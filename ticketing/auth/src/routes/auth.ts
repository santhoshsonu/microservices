import express, { Request, Response, NextFunction } from 'express';
import { check, validationResult } from 'express-validator';

import { RequestValidationError } from '../utils/errors/request-validation-error';
import { signIn, signOut, signUp, currentUser } from '../controllers/auth-controller';

const router = express.Router();

/**
 * Get current user
 */
router.get('/currentuser',
  async (req, res, next) => {
    try {
      // TODO: Implementation
      currentUser();
    } catch (err) { return next(err); }
    res.json({ msg: 'Hi there!' });
  });

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
  async (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next(new RequestValidationError(errors.array()));
    }

    const { email, password }: { email: string; password: string } = req.body;
    try {
      // TODO: Implementation
      signUp('', '');
    } catch (err) { return next(err); }

    res.status(201).json({ email });
  });

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
  async (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next(new RequestValidationError(errors.array()));
    }

    const { email, password }: { email: string; password: string } = req.body;

    try {
      // TODO: Implementation
      signIn('', '');
    } catch (err) { return next(err); };

    res.status(201).json({ email });
  });

/**
 * Signout a user
 */
router.post('/signout', async (req, res, next) => {
  try {
    // TODO: Implementation
    signOut();
  } catch (err) { return next(err); }
  res.json({ msg: 'Signout :(' });
});

export { router as authRouter };