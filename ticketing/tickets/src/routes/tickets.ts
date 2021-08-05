import { requireAuth, validateRequest } from '@microservice-tickets/common';
import express from 'express';
import { check } from 'express-validator';
import { createTicket, getTicket, getTickets, updateTicket } from '../controllers/tickets';

const router = express.Router();

/**
 * Add new ticket route
 */
router.post('/', requireAuth,
  [
    check('title').notEmpty().withMessage('Title is required'),
    check('price')
      .isFloat({ gt: 0 })
      .withMessage('Price must be greater than 0')
  ],
  validateRequest,
  createTicket);

/**
 * List all tickets route
*/
router.get('/',
  getTickets
);

/**
 * Get ticket by id route
*/
router.get('/:id',
  requireAuth,
  getTicket
);

/**
 * Update ticket by id route
*/
router.put('/:id',
  requireAuth,
  [
    check('title').notEmpty().withMessage('Title is required'),
    check('price')
      .isFloat({ gt: 0 })
      .withMessage('Price must be greater than 0')
  ],
  validateRequest,
  updateTicket
);


export { router as ticketsRouter };
