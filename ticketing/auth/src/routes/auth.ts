import express, { Request, Response, NextFunction } from 'express';
import { check, validationResult } from 'express-validator';

import { signIn, signOut, signUp, currentUser } from '../controllers/auth-controller';

const router = express.Router();

/**
 * Get current user
 */
router.get('/currentuser', (req, res, next) => {
  // TODO: Implementation
  currentUser();
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
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password }: { email: string; password: string } = req.body;
    // TODO: Implementation
    signUp('', '');

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
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password }: { email: string; password: string } = req.body;
    // TODO: Implementation
    signIn('', '');

    res.status(201).json({ email });
  });

/**
 * Signout a user
 */
router.post('/signout', (req, res, next) => {
  signOut();
  res.json({ msg: 'Signout :(' });
});

export { router as authRouter };