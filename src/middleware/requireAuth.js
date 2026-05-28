"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireAuth = void 0;
const jwt_1 = require("../utils/jwt");
const user_model_1 = require("../modules/users/user.model");
const requireAuth = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            const err = new Error('No token provided');
            err.statusCode = 401;
            err.code = 'UNAUTHORIZED';
            return next(err);
        }
        const token = authHeader.split(' ')[1];
        let decoded;
        try {
            decoded = (0, jwt_1.verifyAccess)(token);
        }
        catch (e) {
            const err = new Error('Access token expired or invalid');
            err.statusCode = 401;
            err.code = e.name === 'TokenExpiredError' ? 'TOKEN_EXPIRED' : 'TOKEN_INVALID';
            return next(err);
        }
        const user = await user_model_1.User.findOne({ _id: decoded.userId, isDeleted: false });
        if (!user) {
            const err = new Error('User not found');
            err.statusCode = 401;
            err.code = 'UNAUTHORIZED';
            return next(err);
        }
        req.user = user;
        next();
    }
    catch (error) {
        next(error);
    }
};
exports.requireAuth = requireAuth;
//# sourceMappingURL=requireAuth.js.map