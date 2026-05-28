"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logout = exports.refresh = exports.login = exports.register = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const user_model_1 = require("../users/user.model");
const jwt_1 = require("../../utils/jwt");
const env_1 = require("../../config/env");
const register = async (req, res, next) => {
    try {
        const { name, email, password } = req.body;
        const existing = await user_model_1.User.findOne({ email });
        if (existing) {
            const err = new Error('Email already in use');
            err.statusCode = 409;
            err.code = 'CONFLICT';
            return next(err);
        }
        const hashedPassword = await bcryptjs_1.default.hash(password, 10);
        const user = await user_model_1.User.create({ name, email, password: hashedPassword });
        res.status(201).json({ success: true, data: { _id: user._id, name: user.name, email: user.email } });
    }
    catch (error) {
        next(error);
    }
};
exports.register = register;
const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const user = await user_model_1.User.findOne({ email, isDeleted: false });
        if (!user || !user.password) {
            const err = new Error('Invalid credentials');
            err.statusCode = 401;
            err.code = 'UNAUTHORIZED';
            return next(err);
        }
        const isValid = await bcryptjs_1.default.compare(password, user.password);
        if (!isValid) {
            const err = new Error('Invalid credentials');
            err.statusCode = 401;
            err.code = 'UNAUTHORIZED';
            return next(err);
        }
        const accessToken = (0, jwt_1.signAccess)(user.id);
        const refreshToken = (0, jwt_1.signRefresh)(user.id);
        user.refreshTokenHash = await bcryptjs_1.default.hash(refreshToken, 10);
        await user.save();
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: env_1.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });
        res.status(200).json({ success: true, data: { accessToken, user: { _id: user.id, name: user.name, email: user.email } } });
    }
    catch (error) {
        next(error);
    }
};
exports.login = login;
const refresh = async (req, res, next) => {
    try {
        const { refreshToken } = req.cookies || {};
        if (!refreshToken) {
            const err = new Error('No refresh token provided');
            err.statusCode = 401;
            err.code = 'REFRESH_TOKEN_INVALID';
            return next(err);
        }
        let decoded;
        try {
            decoded = (0, jwt_1.verifyRefresh)(refreshToken);
        }
        catch (e) {
            const err = new Error('Invalid refresh token');
            err.statusCode = 401;
            err.code = 'REFRESH_TOKEN_INVALID';
            return next(err);
        }
        const user = await user_model_1.User.findOne({ _id: decoded.userId, isDeleted: false });
        if (!user || !user.refreshTokenHash) {
            const err = new Error('Invalid refresh token');
            err.statusCode = 401;
            err.code = 'REFRESH_TOKEN_INVALID';
            return next(err);
        }
        const isValid = await bcryptjs_1.default.compare(refreshToken, user.refreshTokenHash);
        if (!isValid) {
            // Possible breach
            user.refreshTokenHash = undefined;
            await user.save();
            const err = new Error('Invalid refresh token');
            err.statusCode = 401;
            err.code = 'REFRESH_TOKEN_INVALID';
            return next(err);
        }
        const newAccessToken = (0, jwt_1.signAccess)(user.id);
        const newRefreshToken = (0, jwt_1.signRefresh)(user.id);
        user.refreshTokenHash = await bcryptjs_1.default.hash(newRefreshToken, 10);
        await user.save();
        res.cookie('refreshToken', newRefreshToken, {
            httpOnly: true,
            secure: env_1.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000
        });
        res.status(200).json({ success: true, data: { accessToken: newAccessToken } });
    }
    catch (error) {
        next(error);
    }
};
exports.refresh = refresh;
const logout = async (req, res, next) => {
    try {
        const { refreshToken } = req.cookies || {};
        if (refreshToken) {
            try {
                const decoded = (0, jwt_1.verifyRefresh)(refreshToken);
                const user = await user_model_1.User.findById(decoded.userId);
                if (user) {
                    user.refreshTokenHash = undefined;
                    await user.save();
                }
            }
            catch (e) {
                // Ignore token errors on logout
            }
        }
        res.clearCookie('refreshToken', {
            httpOnly: true,
            secure: env_1.env.NODE_ENV === 'production',
            sameSite: 'strict',
        });
        res.status(200).json({ success: true, data: null });
    }
    catch (error) {
        next(error);
    }
};
exports.logout = logout;
const me = async (req, res, next) => {
    try {
        const user = req.user;
        if (!user) {
            const err = new Error('Not authenticated');
            err.statusCode = 401;
            err.code = 'UNAUTHORIZED';
            return next(err);
        }
        res.status(200).json({ success: true, data: { user: { _id: user._id, name: user.name, email: user.email } } });
    }
    catch (error) {
        next(error);
    }
};
exports.me = me;
//# sourceMappingURL=auth.controller.js.map