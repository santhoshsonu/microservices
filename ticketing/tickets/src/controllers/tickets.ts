import { DatabaseConnectionError, NotFoundError, UnAuthorizedError } from '@microservice-tickets/common';
import { NextFunction, Request, Response } from 'express';
import { Ticket, TicketDoc } from '../models/ticket';

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

/**
 * Get Ticket by id
 * Request path params
 * @param id: string
 */
export const getTickets = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const tickets = await Ticket.find({});
    res.json(tickets);
  } catch (_) {
    return next(new DatabaseConnectionError());
  }
}

/**
 * Get Ticket by id
 * Request path params
 * @param id: string
 */
export const getTicket = async (req: Request, res: Response, next: NextFunction) => {
  const id = req.params?.id;
  try {
    const ticket = await Ticket.findById(id);
    if (!ticket) {
      return next(new NotFoundError());
    }
    res.status(200).json(ticket);
  } catch (error) {
    return next(new DatabaseConnectionError());
  }
};

/**
 * Update Ticket
 * Request path params
 * @param id: string
 * Request Body params
 * @param title: string
 * @param price: number
 */
export const updateTicket = async (req: Request, res: Response, next: NextFunction) => {
  const id = req.params?.id;
  let ticket: TicketDoc | null;
  try {
    ticket = await Ticket.findById(id);
    if (!ticket) {
      return next(new NotFoundError());
    }
  } catch (error) {
    return next(new DatabaseConnectionError());
  }

  if (ticket.userId !== req.currentUser!.id) {
    return next(new UnAuthorizedError());
  }

  const { title, price } = req.body;
  try {
    ticket.set({
      title, price
    });
    await ticket.save();
  } catch (error) {
    return next(new DatabaseConnectionError());
  }
  res.status(200).json(ticket);
};
