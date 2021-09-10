import { requireAuth, validateRequest } from '@microservice-tickets/common';
import express from 'express';
import { check } from 'express-validator';
import mongoose from 'mongoose';
import { cancleOrder, createOrder, getOrderById, getOrders } from '../controllers/orders';

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
  requireAuth,
  getOrders
);

/**
 * Get order by id route
*/
router.get('/:orderId', requireAuth,
  [
    check('orderId')
      .notEmpty()
      .withMessage('OrderId id is required')
      .custom((input: string) => mongoose.Types.ObjectId.isValid(input))
      .withMessage('Invalid Order Id')
  ],
  validateRequest,
  getOrderById
);

/**
 * Cancel order by id route
*/
router.delete('/:orderId',
  requireAuth,
  [
    check('orderId')
      .notEmpty()
      .withMessage('OrderId id is required')
      .custom((input: string) => mongoose.Types.ObjectId.isValid(input))
      .withMessage('Invalid Order Id')
  ],
  validateRequest,
  cancleOrder
);


export { router as ordersRouter };
