import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config/config';

interface UserPayload {
  id: string;
  email: string;
  iat: number;
}

// Add additional currentUser property
// to Request object of Express type definition
declare global {
  namespace Express {
    interface Request {
      currentUser?: UserPayload
    }
  }
}

export const currentUserMiddleware = (req: Request, res: Response, next: NextFunction) => {
  if (!req.session?.jwt) { // Equivalent to !req.session || !req.session.jwt
    return next();
  }
  try {
    const payload = jwt.verify(req.session.jwt, config.JWT_KEY!) as UserPayload;
    req.currentUser = payload;
  } catch (error) {
    console.log(`Error while verifying JWT token.\n${error}`);
  }
  return next();
}