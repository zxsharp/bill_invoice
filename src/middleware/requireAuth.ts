import { Request, Response, NextFunction } from 'express';
import { verifyAccess } from '../utils/jwt';
import { User } from '../modules/users/user.model';

export const requireAuth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      const err = new Error('No token provided') as any;
      err.statusCode = 401;
      err.code = 'UNAUTHORIZED';
      return next(err);
    }

    const token = authHeader.split(' ')[1]!;
    let decoded;
    try {
      decoded = verifyAccess(token);
    } catch (e: any) {
      const err = new Error('Access token expired or invalid') as any;
      err.statusCode = 401;
      err.code = e.name === 'TokenExpiredError' ? 'TOKEN_EXPIRED' : 'TOKEN_INVALID';
      return next(err);
    }

    const user = await User.findOne({ _id: decoded.userId, isDeleted: false });
    if (!user) {
      const err = new Error('User not found') as any;
      err.statusCode = 401;
      err.code = 'UNAUTHORIZED';
      return next(err);
    }

    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};
