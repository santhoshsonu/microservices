import express, { Request, Response, NextFunction } from 'express';
import { check, validationResult } from 'express-validator';

import { RequestValidationError } from '../utils/errors/request-validation-error';
import { signIn, signOut, signUp, currentUser } from '../controllers/auth-controller';

const router = express.Router();

/**
 * Get current user
 */
router.get('/currentuser', signIn);

/**
 * Add a new user
 * Request Body params
 * @param email: string
 * @param password: string
 */
router.post('/signup',
  [
    check('email')
      .isEmail()
      .withMessage('Email must be valid'),
    check('password')
      .trim()
      .isLength({ min: 4, max: 25 })
      .withMessage('Password must be between 4 and 25 characters')
  ],
  signUp
);

/**
 * Authenticate a user
 * Request Body params
 * @param email: string
 * @param password: string
 */
router.post('/signin',
  [
    check('email')
      .isEmail()
      .withMessage('Email must be valid'),
    check('password')
      .trim()
      .isLength({ min: 4, max: 25 })
      .withMessage('Password must be between 4 and 25 characters')
  ],
  signIn);

/**
 * Signout a user
 */
router.post('/signout', signOut);

export { router as authRouter };