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

  // Generate order created event

  res.status(201).json(order);
}
