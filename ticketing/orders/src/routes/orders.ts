import { requireAuth, validateRequest } from '@microservice-tickets/common';
import express from 'express';
import { check } from 'express-validator';
import mongoose from 'mongoose';
import { createOrder } from '../controllers/orders';

const router = express.Router();

/**
 * Add new order route
 */
router.post('/', requireAuth,
  [
    check('ticketId')
      .notEmpty()
      .withMessage('Ticket id is required')
      .custom((input: string) => mongoose.Types.ObjectId.isValid(input))
      .withMessage('Invalid Ticket Id')
  ],
  validateRequest,
  createOrder
);

/**
 * List all orders route
*/
router.get('/',

);

/**
 * Get order by id route
*/
router.get('/:id',
  requireAuth,

);

/**
 * Cancel order by id route
*/
router.delete('/:id',
  requireAuth,

);


export { router as ordersRouter };
