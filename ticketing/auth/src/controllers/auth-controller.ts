import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import { User } from '../models/user';
import { BadRequestError } from '../utils/errors/bad-request-error';

import { DatabaseConnectionError } from '../utils/errors/database-connection-error';
import { RequestValidationError } from '../utils/errors/request-validation-error';

/**
 * Authenticate a user
 * Request Body params
 * @param email: string
 * @param password: string
 */
export const signIn = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // TODO: Implementation
    throw new DatabaseConnectionError();
  } catch (err) { return next(err); }
}

/**
 * Add a new user
 * Request Body params
 * @param email: string
 * @param password: string
 */
export const signUp = async (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new RequestValidationError(errors.array()));
  }
  const { email, password }: { email: string; password: string } = req.body;
  try {
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      console.log(`Email already in use`);
      const errors = [{ message: 'Email already in use' }];
      return next(new BadRequestError('Email already in use'));
    }
  } catch (err) {
    console.log(`Database Error: ${err.message}`);
    return next(new DatabaseConnectionError);
  }

  const user = User.build({ email, password });
  try {
    await user.save();
  } catch (err) {
    console.log(`Database Error: ${err.message}`);
    return next(new DatabaseConnectionError);
  }

  res.status(201).json(user);
};

/**
 * Get current user
 */
export const currentUser = async (req: Request, res: Response, next: NextFunction) => {
  throw new DatabaseConnectionError();
};

/**
 * Signout a user
 */
export const signOut = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // TODO: Implementation
    throw new DatabaseConnectionError();
  } catch (err) { return next(err); }
};
