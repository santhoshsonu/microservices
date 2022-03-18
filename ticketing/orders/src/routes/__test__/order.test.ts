import mongoose from 'mongoose';
import request from 'supertest';
import { app } from '../../app';
import { Ticket } from '../../models/ticket';
import { Order, OrderStatus } from '../../models/order';
import { natsWrapper } from '../../nats-wrapper';


const buildTicket = async () => {
  const createdAt = new Date();

  return await Ticket.build({
    id: mongoose.Types.ObjectId().toHexString(),
    title: 'ABC',
    price: 10,
    createdAt,
    updatedAt: createdAt
  }).save();
};

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

it('returns a status of 400 if the ticket id is invalid', async () => {
  await request(app)
    .post('/api/orders')
    .set('Cookie', global.getCookie())
    .send({
      ticketId: 'asdadad'
    })
    .expect(400);
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
  const ticket = await buildTicket();

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
  const ticket = await buildTicket();

  await ticket.save();

  const response = await request(app)
    .post('/api/orders')
    .set('Cookie', global.getCookie())
    .send({ ticketId: ticket.id })

  expect(response.status).toEqual(201);
  expect(response.body.ticket.id).toEqual(ticket.id);
});

it('emits an order created event', async () => {
  const ticket = await buildTicket();

  const response = await request(app)
    .post('/api/orders')
    .set('Cookie', global.getCookie())
    .send({ ticketId: ticket.id })
    .expect(201);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});

/**
 * Tests for Get Orders By User   
 */

it('has a route handler listening to /api/orders for GET requests', async () => {
  const response = await request(app)
    .get('/api/orders')
    .send();
  expect(response.status).not.toEqual(404);
});

it('can only be accessed if the user is signed in', async () => {
  await request(app)
    .get('/api/orders')
    .send()
    .expect(401);
});

it('returns a status other than 401 if the user is signed in', async () => {
  const response = await request(app)
    .get('/api/orders')
    .set('Cookie', global.getCookie())
    .send();
  expect(response.status).not.toEqual(401);
});

it('fetches orders for a particular user', async () => {
  // create three tickets
  const ticketOne = await buildTicket();
  const ticketTwo = await buildTicket();
  const ticketThree = await buildTicket();

  const userOne = global.getCookie();
  const userTwo = global.getCookie();

  // create one order as User #1
  await request(app)
    .post('/api/orders')
    .set('Cookie', userOne)
    .send({ ticketId: ticketOne.id })
    .expect(201);

  // create two orders as User #2
  const { body: orderOne } = await request(app)
    .post('/api/orders')
    .set('Cookie', userTwo)
    .send({ ticketId: ticketTwo.id })
    .expect(201);
  const { body: orderTwo } = await request(app)
    .post('/api/orders')
    .set('Cookie', userTwo)
    .send({ ticketId: ticketThree.id })
    .expect(201);

  const response = await request(app)
    .get('/api/orders')
    .set('Cookie', userTwo)
    .send()
    .expect(200);
  expect(response.body.length).toEqual(2);
  expect(response.body[0].id).toEqual(orderOne.id);
  expect(response.body[1].id).toEqual(orderTwo.id);
  expect(response.body[0].ticket.id).toEqual(ticketTwo.id);
  expect(response.body[1].ticket.id).toEqual(ticketThree.id);

});

/**
 * Tests for Get Orders By Order Id   
 */

it('GET ORDER BY ID: has a route handler listening to /api/orders/:orderId for GET requests', async () => {
  const orderId = mongoose.Types.ObjectId().toHexString();
  const response = await request(app)
    .get(`/api/orders/${orderId}`)
    .send();
  expect(response.status).not.toEqual(404);
});

it('GET ORDER BY ID: can only be accessed if the user is signed in', async () => {
  const orderId = mongoose.Types.ObjectId().toHexString();
  await request(app)
    .get(`/api/orders/${orderId}`)
    .send()
    .expect(401);
});

it('GET ORDER BY ID: returns a status other than 401 if the user is signed in', async () => {
  const orderId = mongoose.Types.ObjectId().toHexString();
  const response = await request(app)
    .get(`/api/orders/${orderId}`)
    .set('Cookie', global.getCookie())
    .send();
  expect(response.status).not.toEqual(401);
});

it('GET ORDER BY ID: return 400 with invalid order id', async () => {
  const orderId = "aadsadad";
  await request(app)
    .get(`/api/orders/${orderId}`)
    .set('Cookie', global.getCookie())
    .send()
    .expect(400);
});

it('GET ORDER BY ID: return 404 if order does not exists', async () => {
  const orderId = mongoose.Types.ObjectId().toHexString();
  const response = await request(app)
    .get(`/api/orders/${orderId}`)
    .set('Cookie', global.getCookie())
    .send();
  expect(response.status).toEqual(404);
});

it('GET ORDER BY ID: return 401 if order does not belong to user', async () => {
  const ticket = await buildTicket();

  const userOne = global.getCookie();
  const userTwo = global.getCookie();

  const { body: order } = await request(app)
    .post('/api/orders')
    .set('Cookie', userOne)
    .send({ ticketId: ticket.id })
    .expect(201);
  await request(app)
    .get(`/api/orders/${order.id}`)
    .set('Cookie', userTwo)
    .send()
    .expect(401);
});

it('GET ORDER BY ID: fetches orders for a particular orderId', async () => {
  const ticket = await buildTicket();

  const user = global.getCookie();

  const { body: order } = await request(app)
    .post('/api/orders')
    .set('Cookie', user)
    .send({ ticketId: ticket.id })
    .expect(201);

  const { body } = await request(app)
    .get(`/api/orders/${order.id}`)
    .set('Cookie', user)
    .send()
    .expect(200);
  expect(body.id).toEqual(order.id);
  expect(body.ticket.id).toEqual(ticket.id);
});

/**
 * Tests for Delete Order  
 */

it('DELETE ORDER: has a route handler listening to /api/orders/:orderId for DELETE requests', async () => {
  const orderId = mongoose.Types.ObjectId().toHexString();
  const response = await request(app)
    .delete(`/api/orders/${orderId}`)
    .send();
  expect(response.status).not.toEqual(404);
});

it('DELETE ORDER: can only be accessed if the user is signed in', async () => {
  const orderId = mongoose.Types.ObjectId().toHexString();
  await request(app)
    .delete(`/api/orders/${orderId}`)
    .send()
    .expect(401);
});

it('DELETE ORDER: returns a status other than 401 if the user is signed in', async () => {
  const orderId = mongoose.Types.ObjectId().toHexString();
  const response = await request(app)
    .delete(`/api/orders/${orderId}`)
    .set('Cookie', global.getCookie())
    .send();
  expect(response.status).not.toEqual(401);
});

it('DELETE ORDER: return 400 with invalid order id', async () => {
  const orderId = "aadsadad";
  await request(app)
    .delete(`/api/orders/${orderId}`)
    .set('Cookie', global.getCookie())
    .send()
    .expect(400);
});

it('DELETE ORDER: return 404 if order does not exists', async () => {
  const orderId = mongoose.Types.ObjectId().toHexString();
  const response = await request(app)
    .delete(`/api/orders/${orderId}`)
    .set('Cookie', global.getCookie())
    .send();
  expect(response.status).toEqual(404);
});

it('DELETE ORDER: return 401 if order does not belong to user', async () => {
  const ticket = await buildTicket();

  const userOne = global.getCookie();
  const userTwo = global.getCookie();

  const { body: order } = await request(app)
    .post('/api/orders')
    .set('Cookie', userOne)
    .send({ ticketId: ticket.id })
    .expect(201);
  await request(app)
    .delete(`/api/orders/${order.id}`)
    .set('Cookie', userTwo)
    .send()
    .expect(401);
});

it('DELETE ORDER: Deletes an order', async () => {
  const ticket = await buildTicket();

  const user = global.getCookie();

  const { body: order } = await request(app)
    .post('/api/orders')
    .set('Cookie', user)
    .send({ ticketId: ticket.id })
    .expect(201);

  await request(app)
    .delete(`/api/orders/${order.id}`)
    .set('Cookie', user)
    .send()
    .expect(204);
  const updatedOrder = await Order.findById(order.id);
  expect(updatedOrder).not.toEqual(null);
  expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled);
});

it('DELETE ORDER: emits an order cancelled event', async () => {
  const ticket = await buildTicket();

  const user = global.getCookie();

  const { body: order } = await request(app)
    .post('/api/orders')
    .set('Cookie', user)
    .send({ ticketId: ticket.id })
    .expect(201);

  await request(app)
    .delete(`/api/orders/${order.id}`)
    .set('Cookie', user)
    .send()
    .expect(204);
  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
