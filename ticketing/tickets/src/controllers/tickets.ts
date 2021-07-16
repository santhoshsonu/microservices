import { DatabaseConnectionError } from '@microservice-tickets/common';
import { NextFunction, Request, Response } from 'express';
import { Ticket } from '../models/ticket';

/**
 * Add a new Ticket
 * Request Body params
 * @param title: string
 * @param price: number
 */
export const createTicket = async (req: Request, res: Response, next: NextFunction) => {
  const { title, price } = req.body;
  const ticket = Ticket.build({
    title,
    price,
    userId: req.currentUser!.id
  })
  try {
    await ticket.save();
  } catch (error) {
    return next(new DatabaseConnectionError());
  }
  res.status(201).json(ticket);
};
