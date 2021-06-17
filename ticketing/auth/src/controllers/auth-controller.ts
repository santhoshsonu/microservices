// import express from 'express';

import { DatabaseConnectionError } from '../utils/errors/database-connection-error';

/**
 * Authenticate a user
 * Request Body params
 * @param email: string
 * @param password: string
 */
export const signIn = (email: string, password: string): boolean => {
  throw new DatabaseConnectionError();
};

/**
 * Add a new user
 * Request Body params
 * @param email: string
 * @param password: string
 */
export const signUp = (email: string, password: string): boolean => {
  throw new DatabaseConnectionError();
};

/**
 * Get current user
 */
export const currentUser = (): boolean => {
  throw new DatabaseConnectionError();
};

/**
 * Signout a user
 */
export const signOut = (): boolean => {
  throw new DatabaseConnectionError();
};
