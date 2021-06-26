import express from 'express';
import { check } from 'express-validator';
import { currentUser, signIn, signOut, signUp } from '../controllers/auth-controller';
import { validateRequest } from '../middlewares/validate-request';
import { currentUserMiddleware } from '../middlewares/current-user';

const router = express.Router();

/**
 * Get current user
 */
router.get('/currentuser',
  currentUserMiddleware,
  currentUser);

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
  validateRequest,
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
      .notEmpty()
      .withMessage('Password must not be empty')
  ],
  validateRequest,
  signIn);

/**
 * Signout a user
 */
router.post('/signout', signOut);

export { router as authRouter };
