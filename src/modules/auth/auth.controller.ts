import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import { User } from '../users/user.model';
import { signAccess, signRefresh, verifyRefresh } from '../../utils/jwt';
import { env } from '../../config/env';

export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, email, password } = req.body;
    const existing = await User.findOne({ email });
    if (existing) {
      const err = new Error('Email already in use') as any;
      err.statusCode = 409;
      err.code = 'CONFLICT';
      return next(err);
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashedPassword });
    
    res.status(201).json({ success: true, data: { _id: user._id, name: user.name, email: user.email } });
  } catch (error) {
    next(error);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email, isDeleted: false });
    if (!user || !user.password) {
      const err = new Error('Invalid credentials') as any;
      err.statusCode = 401;
      err.code = 'UNAUTHORIZED';
      return next(err);
    }

    let isValid = false;
    const stored = user.password || '';
    const looksHashed = stored.startsWith('$2');
    if (looksHashed) {
      isValid = await bcrypt.compare(password, stored);
    } else {
      // Legacy/seeded plaintext password — accept if equal and re-hash it for security
      if (password === stored) {
        isValid = true;
        user.password = await bcrypt.hash(password, 10);
        await user.save();
      }
    }

    if (!isValid) {
      const err = new Error('Invalid credentials') as any;
      err.statusCode = 401;
      err.code = 'UNAUTHORIZED';
      return next(err);
    }

    const accessToken = signAccess(user.id);
    const refreshToken = signRefresh(user.id);

    user.refreshTokenHash = await bcrypt.hash(refreshToken, 10);
    await user.save();

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    res.status(200).json({ success: true, data: { accessToken, user: { _id: user.id, name: user.name, email: user.email } } });
  } catch (error) {
    next(error);
  }
};

export const refresh = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { refreshToken } = req.cookies || {};
    if (!refreshToken) {
      const err = new Error('No refresh token provided') as any;
      err.statusCode = 401;
      err.code = 'REFRESH_TOKEN_INVALID';
      return next(err);
    }

    let decoded;
    try {
      decoded = verifyRefresh(refreshToken);
    } catch (e) {
      const err = new Error('Invalid refresh token') as any;
      err.statusCode = 401;
      err.code = 'REFRESH_TOKEN_INVALID';
      return next(err);
    }

    const user = await User.findOne({ _id: decoded.userId, isDeleted: false });
    if (!user || !user.refreshTokenHash) {
      const err = new Error('Invalid refresh token') as any;
      err.statusCode = 401;
      err.code = 'REFRESH_TOKEN_INVALID';
      return next(err);
    }

    const isValid = await bcrypt.compare(refreshToken, user.refreshTokenHash);
    if (!isValid) {
      // Possible breach
      (user as any).refreshTokenHash = undefined;
      await user.save();
      const err = new Error('Invalid refresh token') as any;
      err.statusCode = 401;
      err.code = 'REFRESH_TOKEN_INVALID';
      return next(err);
    }

    const newAccessToken = signAccess(user.id);
    const newRefreshToken = signRefresh(user.id);

    user.refreshTokenHash = await bcrypt.hash(newRefreshToken, 10);
    await user.save();

    res.cookie('refreshToken', newRefreshToken, {
      httpOnly: true,
      secure: env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    res.status(200).json({ success: true, data: { accessToken: newAccessToken } });
  } catch (error) {
    next(error);
  }
};

export const logout = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { refreshToken } = req.cookies || {};
    if (refreshToken) {
      try {
        const decoded = verifyRefresh(refreshToken);
        const user = await User.findById(decoded.userId);
        if (user) {
          (user as any).refreshTokenHash = undefined;
          await user.save();
        }
      } catch (e) {
        // Ignore token errors on logout
      }
    }
    
    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: env.NODE_ENV === 'production',
      sameSite: 'strict',
    });
    res.status(200).json({ success: true, data: null });
  } catch (error) {
    next(error);
  }
};

export const me = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = (req as any).user;
    if (!user) {
      const err = new Error('Not authenticated') as any;
      err.statusCode = 401;
      err.code = 'UNAUTHORIZED';
      return next(err);
    }

    res.status(200).json({ success: true, data: { user: { _id: user._id, name: user.name, email: user.email } } });
  } catch (error) {
    next(error);
  }
};
