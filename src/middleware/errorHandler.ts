import { Request, Response, NextFunction } from 'express';

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
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
