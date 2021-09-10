import { BadRequestError, DatabaseConnectionError, NotFoundError, OrderStatus, UnAuthorizedError } from '@microservice-tickets/common';
import { NextFunction, Request, Response } from 'express';
import { Order } from '../models/order';
import { Ticket, TicketDoc } from '../models/ticket';


const EXPIRATION_WINDOW_SECONDS = 15 * 60;

/**
 * Add a new Order for the ticket
 * Request Body params
 * @param ticketId: string
 */
export const createOrder = async (req: Request, res: Response, next: NextFunction) => {
  // Find the ticket the user is trying to order in database
  const { ticketId } = req.body;
  let ticket: TicketDoc | null;

  try {
    ticket = await Ticket.findById(ticketId);
  } catch (error) {
    return next(new DatabaseConnectionError());
  }

  if (!ticket) {
    return next(new NotFoundError());
  }

  // Make sure the ticket is not aleady reserved.
  try {
    const isReserved = await ticket.isReserved();
    if (isReserved) {
      return next(new BadRequestError('Ticket is already reserved'));
    }
  } catch (error) {
    return next(new DatabaseConnectionError());
  }

  // Calculate an expiration date for the ticket
  const expiration = new Date();
  expiration.setSeconds(expiration.getSeconds() + EXPIRATION_WINDOW_SECONDS);

  // Build the order and save to database
  const order = Order.build({
    userId: req.currentUser!.id,
    status: OrderStatus.Created,
    expiresAt: expiration,
    ticket
  });
  try {
    await order.save();
  } catch (error) {
    return next(new DatabaseConnectionError());
  }

  // TODO: Publish order created event

  res.status(201).json(order);
}

/**
 * Get all orders for the user
 */
export const getOrders = async (req: Request, res: Response, next: NextFunction) => {
  const userId = req.currentUser!.id;
  try {
    const orders = await Order.find({ userId }).populate('ticket');
    res.status(200).json(orders);
  } catch (_) {
    return next(new DatabaseConnectionError());
  }
}

/**
 * Get orders by order id
 */
export const getOrderById = async (req: Request, res: Response, next: NextFunction) => {
  const userId = req.currentUser!.id;
  const { orderId } = req.params;

  try {
    const order = await Order.findById(orderId).populate('ticket');
    if (!order) {
      return next(new NotFoundError());
    }
    if (order.userId != userId) {
      return next(new UnAuthorizedError());
    }
    res.status(200).json(order);
  } catch (_) {
    return next(new DatabaseConnectionError());
  }
}

/**
 * Cancel order
 */
export const cancleOrder = async (req: Request, res: Response, next: NextFunction) => {
  const userId = req.currentUser!.id;
  const { orderId } = req.params;

  try {
    const order = await Order.findById(orderId);
    if (!order) {
      return next(new NotFoundError());
    }
    if (order.userId != userId) {
      return next(new UnAuthorizedError());
    }
    order.status = OrderStatus.Cancelled;
    await order.save();

    // TODO: Publish order created event

    res.status(204).json(order);
  } catch (_) {
    return next(new DatabaseConnectionError());
  }
}
