import { Request, Response, NextFunction } from 'express';
import { UnAuthorizedError } from '../utils/errors/unauthorized-error';

export const requireAuth = (req: Request, res: Response, next: NextFunction) => {
  if (!req.currentUser) {
    throw new UnAuthorizedError();
  }
  next();
}