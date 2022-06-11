import mongoose from 'mongoose';
import request from 'supertest';
import { OrderStatus } from '@microservice-tickets/common';
import { app } from '../../app';
import { Order } from '../../models/order';
import { stripe } from "../../stripe";
import { Payment } from '../../models/payment';

/**
 * Create new Payment Tests
 */

it('returns a 404 when purchasing an order that does not exist', async () => {
    await request(app)
        .post('/api/payments')
        .set('Cookie', global.getCookie())
        .send({
            paymentMethodId: 'asldkfj',
            orderId: mongoose.Types.ObjectId().toHexString(),
        })
        .expect(404);
});

it('returns a 401 when purchasing an order that doesnt belong to the user', async () => {
    const order = Order.build({
        id: mongoose.Types.ObjectId().toHexString(),
        userId: mongoose.Types.ObjectId().toHexString(),
        price: 20,
        status: OrderStatus.Created,
    });
    await order.save();

    await request(app)
        .post('/api/payments')
        .set('Cookie', global.getCookie())
        .send({
            paymentMethodId: 'asldkfj',
            orderId: order.id,
        })
        .expect(401);
});

it('returns a 400 when purchasing a cancelled order', async () => {
    const userId = mongoose.Types.ObjectId().toHexString();
    const order = Order.build({
        id: mongoose.Types.ObjectId().toHexString(),
        userId,
        price: 20,
        status: OrderStatus.Cancelled,
    });
    await order.save();

    await request(app)
        .post('/api/payments')
        .set('Cookie', global.getCookie(userId))
        .send({
            orderId: order.id,
            paymentMethodId: 'asdlkfj',
        })
        .expect(400);
});

it('returns a 200 with 3d secure not supported card', async () => {
    const userId = mongoose.Types.ObjectId().toHexString();
    const price = Math.floor(Math.random() * 10000)
    const order = Order.build({
        id: mongoose.Types.ObjectId().toHexString(),
        userId,
        price,
        status: OrderStatus.Created,
    });
    await order.save();

    const response = await request(app)
        .post('/api/payments')
        .set('Cookie', global.getCookie(userId))
        .send({
            orderId: order.id,
            paymentMethodId: 'pm_card_amex_threeDSecureNotSupported',
        });

    const intent = response.body;
    expect(response.statusCode).toEqual(200);
    expect(intent.success).toEqual(true);
    expect(intent.paymentId).toBeDefined();
    expect(intent.stripeId).toBeDefined();

    const payment = await Payment.findOne({ orderId: order.id, stripeId: intent.stripeId });
    expect(payment).not.toBeNull();

    const paymentIntent = await stripe.paymentIntents.retrieve(intent.stripeId);
    expect(paymentIntent.status).toEqual('succeeded');
    expect(paymentIntent.metadata.orderId).toEqual(order.id);
    expect(paymentIntent.metadata.userId).toEqual(userId);
});

it('returns a 200 with 3d secure supported card', async () => {
    const userId = mongoose.Types.ObjectId().toHexString();
    const price = Math.floor(Math.random() * 10000)
    const order = Order.build({
        id: mongoose.Types.ObjectId().toHexString(),
        userId,
        price,
        status: OrderStatus.Created,
    });
    await order.save();

    const response = await request(app)
        .post('/api/payments')
        .set('Cookie', global.getCookie(userId))
        .send({
            orderId: order.id,
            paymentMethodId: 'pm_card_visa'
        });

    const intent = response.body;
    expect(response.statusCode).toEqual(200);
    expect(intent.success).toEqual(false);
    expect(intent.requires_action).toEqual(true);
    expect(intent.stripeId).toBeDefined();
    expect(intent.stripeClientSecret).toBeDefined();

    const payment = await Payment.findOne({ orderId: order.id, stripeId: intent.stripeId });
    expect(payment).not.toBeNull();

    const paymentIntent = await stripe.paymentIntents.retrieve(intent.stripeId);
    expect(paymentIntent.status).toEqual('requires_action');
    expect(paymentIntent.metadata.orderId).toEqual(order.id);
    expect(paymentIntent.metadata.userId).toEqual(userId);

    await request(app)
        .post('/api/payments')
        .set('Cookie', global.getCookie(userId))
        .send({
            orderId: order.id,
            stripeId: payment?.stripeId
        }).expect(200);
});
