import {
    BadRequestError, DatabaseConnectionError, EXPIRATION_WINDOW_SECONDS,
    NotFoundError, OrderStatus, UnAuthorizedError
} from '@microservice-tickets/common';
import { NextFunction, Request, Response } from 'express';
import { Order } from '../models/order';

/**
 * Create a new Payment for the order
 * Request Body params
 * @param token: string
 * @param orderId: string
 */
export const createPayment = async (req: Request, res: Response, next: NextFunction) => {
    const { token, orderId } = req.body;
    const currentUserId = req.currentUser!.id;

    const order = await Order.findById(orderId);

    if (!order) return next(new NotFoundError());

    if (order.userId !== currentUserId) return next(new UnAuthorizedError());

    if (order.status === OrderStatus.Cancelled) return next(new BadRequestError('order is cancelled'));

    res.json({ success: true });
}