import mongoose from 'mongoose';
import request from 'supertest';
import { app } from '../../app';
import { Ticket } from '../../models/ticket';
import { Order, OrderStatus } from '../../models/order';

/**
 * Add new Order Tests  
 */

it('has a route handler listening to /api/orders for POST requests', async () => {
  const response = await request(app)
    .post('/api/orders')
    .send({});
  expect(response.status).not.toEqual(404);
});

it('can only be accessed if the user is signed in', async () => {
  await request(app)
    .post('/api/orders')
    .send({})
    .expect(401);
});

it('returns a status other than 401 if the user is signed in', async () => {
  const response = await request(app)
    .post('/api/orders')
    .set('Cookie', global.getCookie())
    .send({});
  expect(response.status).not.toEqual(401);
});

it('return an error if the ticket does not exists', async () => {
  const ticketId = mongoose.Types.ObjectId().toHexString();

  await request(app)
    .post('/api/orders')
    .set('Cookie', global.getCookie())
    .send({
      ticketId
    })
    .expect(404);
});

it('return an error if the ticket is already reserved', async () => {
  const ticket = Ticket.build({
    title: 'Concert',
    price: 20
  });

  await ticket.save();
  const order = Order.build({
    ticket,
    userId: 'asdadad',
    status: OrderStatus.Created,
    expiresAt: new Date()
  });
  await order.save();
  await request(app)
    .post('/api/orders')
    .set('Cookie', global.getCookie())
    .send({ ticketId: ticket.id })
    .expect(400);
});

it('reserves the ticket', async () => {
  const ticket = Ticket.build({
    title: 'Concert',
    price: 20
  });

  await ticket.save();

  await request(app)
    .post('/api/orders')
    .set('Cookie', global.getCookie())
    .send({ ticketId: ticket.id })
    .expect(201);
});

it('reserves the ticket and publishes event', async () => {
  /*
  const title = 'ABC';
  const price = 10;

  await request(app)
    .post('/api/tickets')
    .set('Cookie', global.getCookie())
    .send({ title, price })
    .expect(201);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
  */
});

