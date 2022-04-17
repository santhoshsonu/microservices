import mongoose from 'mongoose';
import request from 'supertest';
import { OrderStatus } from '@microservice-tickets/common';
import { app } from '../../app';
import { Order } from '../../models/order';

/**
 * Create new Payment Tests  
 */

it('returns a 404 when purchasing an order that does not exist', async () => {
    await request(app)
        .post('/api/payments')
        .set('Cookie', global.getCookie())
        .send({
            token: 'asldkfj',
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
            token: 'asldkfj',
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
            token: 'asdlkfj',
        })
        .expect(400);
});