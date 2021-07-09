import { BadRequestError, config as commonConfig, InternalServerError } from '@microservice-tickets/common';
import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/user';
import { Password } from '../services/password';


/**
 * Add a new user
 * Request Body params
 * @param email: string
 * @param password: string
 */
export const signUp = async (req: Request, res: Response, next: NextFunction) => {
  const { email, password }: { email: string; password: string } = req.body;
  try {
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return next(new BadRequestError('Email already in use'));
    }
  } catch (err) {
    console.log(`Database Error: ${err.message}`);
    return next(new InternalServerError());
  }

  const user = User.build({ email, password });
  try {
    await user.save();
  } catch (err) {
    console.log(`Signup Error: ${err.message}`);
    return next(new InternalServerError());
  }

  // Generate JWT
  // ! symbol to tell TS to ignore
  const userJwt = jwt.sign({
    id: user.id,
    email: user.email
  }, commonConfig.JWT_KEY!);

  // Store jwt on session object
  req.session = {
    jwt: userJwt
  };

  res.status(201).json(user);
};


/**
 * Authenticate a user
 * Request Body params
 * @param email: string
 * @param password: string
 */
export const signIn = async (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;
  try {
    const existingUser = await User.findOne({ email });

    if (!existingUser || !(await Password.compare(existingUser.password, password))) {
      return next(new BadRequestError('Invalid credentials'));
    }

    // Generate JWT
    const userJWT = jwt.sign({
      id: existingUser.id,
      email: existingUser.email
    }, commonConfig.JWT_KEY!);

    // Store jwt on session object
    req.session = {
      jwt: userJWT
    };
    res.status(200).json(existingUser);
  } catch (err) {
    console.log(`Signin Error: ${err.message}`);
    return next(new InternalServerError());
  }
}


/**
 * Get current user
 */
export const currentUser = async (req: Request, res: Response, next: NextFunction) => {
  return res.status(200).json({ currentUser: req.currentUser || null });
};


/**
 * Signout a user
 */
export const signOut = async (req: Request, res: Response, next: NextFunction) => {
  req.session = null;
  res.status(200).json({});
};
