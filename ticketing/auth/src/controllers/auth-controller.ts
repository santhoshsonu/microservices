import express from 'express';

/**
 * Authenticate a user
 * Request Body params
 * @param email: string
 * @param password: string
 */
export const signIn = (email: string, password: string): boolean => {
  return true;
};

/**
 * Add a new user
 * Request Body params
 * @param email: string
 * @param password: string
 */
export const signUp = (email: string, password: string): boolean => {
  return true;
};

/**
 * Get current user
 */
export const currentUser = (): boolean => {
  return true;
};

/**
 * Signout a user
 */
export const signOut = (): boolean => {
  return true;
};