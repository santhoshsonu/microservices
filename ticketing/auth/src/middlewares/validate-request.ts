import { NextFunction, Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { RequestValidationError } from '../utils/errors/request-validation-error';

export const validateRequest = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new RequestValidationError(errors.array());
    throw error;
  }
  next();
}