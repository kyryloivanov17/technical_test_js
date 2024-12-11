import { Request, Response, NextFunction } from 'express';
import { Schema } from 'joi';
import { HttpError } from '../utils/httpError';

export const validateBody = (schema: Schema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const { error } = schema.validate(req.body);

    if (error) {
      next(HttpError(400, error.message));
      return;
    }

    next();
  };
};
