import { requireAuth, validateRequest } from '@microservice-tickets/common';
import express from 'express';
import { check } from 'express-validator';
import { createTicket } from '../controllers/tickets';

const router = express.Router();

router.post('/', requireAuth,
  [
    check('title').notEmpty().withMessage('Title is required'),
    check('price')
      .isFloat({ gt: 0 })
      .withMessage('Price must be greater than 0')
  ],
  validateRequest,
  createTicket);

export { router as ticketsRouter };
