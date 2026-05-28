import { z } from 'zod';
import { Request, Response, NextFunction } from 'express';

export const validate = (schema: z.ZodTypeAny) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        const err: any = new Error('Validation failed');
        err.statusCode = 400;
        err.code = 'VALIDATION_ERROR';
        err.fields = error.flatten().fieldErrors;
        return next(err);
      }
      next(error);
    }
  };
};
