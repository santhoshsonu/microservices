import {
    BadRequestError,
    InternalServerError,
    NotFoundError, OrderStatus, UnAuthorizedError
} from '@microservice-tickets/common';
import { NextFunction, Request, Response } from 'express';
import { Stripe } from 'stripe';
import { PaymentCreatedPublisher } from '../events/publishers/payment-created-publisher';
import { Order } from '../models/order';
import { Payment } from '../models/payment';
import { natsWrapper } from '../nats-wrapper';
import { stripe } from '../stripe';

/**
 * Create a new Payment for the order
 * Request Body params
 * @param token: string
 * @param orderId: string
 */
export const createPayment = async (req: Request, res: Response, next: NextFunction) => {
    const { paymentMethodId, stripeId, orderId } = req.body;
    const currentUserId = req.currentUser!.id;

    const order = await Order.findById(orderId);

    if (!order) return next(new NotFoundError());

    if (order.userId !== currentUserId) return next(new UnAuthorizedError());

    if (order.status === OrderStatus.Cancelled) return next(new BadRequestError('order is cancelled'));

    try {
        let intent: Stripe.PaymentIntent;
        if (paymentMethodId) {
            intent = await stripe.paymentIntents.create({
                currency: 'inr',
                amount: order.price * 100, // in paise
                payment_method: paymentMethodId,
                metadata: {
                    orderId,
                    userId: currentUserId
                },
                confirmation_method: 'manual', // all payment attempts must be initiated using a secret key
                confirm: true
            });
        } else if (stripeId) {
            // confirm payment attempt
            intent = await stripe.paymentIntents.confirm(stripeId);
        } else {
            return next(new BadRequestError('Either paymentMethodId or stripeId is required'));
        }

        let payment = await Payment.findOne({ orderId: order.id, stripeId: intent.id });
        if (!payment) {
            payment = Payment.build({
                orderId,
                stripeId: intent.id
            });
            await payment.save();
        }

        let response: {};
        if (intent.status === 'requires_action' &&
            intent.next_action?.type === 'use_stripe_sdk') {
            // TODO: Publish Payment Awaiting Event

            // Tell the client to handle the action
            response = {
                success: false,
                requires_action: true,
                paymentId: payment.id,
                stripeId: payment.stripeId,
                stripeClientSecret: intent.client_secret
            };
        } else if (intent.status === 'succeeded') {
            // The payment didn’t need any additional actions and completed!
            new PaymentCreatedPublisher(natsWrapper.client).publish({
                id: payment.id,
                orderId: payment.orderId,
                stripeId: payment.stripeId,
                version: payment.version
            });
            response = {
                success: true,
                requires_action: false,
                paymentId: payment.id,
                stripeId: payment.stripeId
            };
        } else {
            // Invalid status
            return next(new Error('Invalid PaymentIntent status'));
        }

        res.status(200).json(response);
    } catch (err: any) {
        console.log(`Payment Error: ${err!.message}`)
        return next(new InternalServerError());
    }

}