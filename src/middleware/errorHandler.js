"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const errorHandler = (err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const errorCode = err.code || 'INTERNAL_ERROR';
    const message = err.message || 'Something went wrong';
    console.error(`[Error] ${errorCode}: ${message}`, err);
    res.status(statusCode).json({
        success: false,
        error: {
            code: errorCode,
            message: message,
            ...(err.fields && { fields: err.fields })
        }
    });
};
exports.errorHandler = errorHandler;
//# sourceMappingURL=errorHandler.js.map