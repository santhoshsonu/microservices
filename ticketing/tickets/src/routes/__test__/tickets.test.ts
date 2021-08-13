import mongoose from 'mongoose';
import request from 'supertest';
import { app } from '../../app';
import { Ticket } from '../../models/ticket';
import { natsWrapper } from '../../nats-wrapper';

const createTicket = () => {
  const title = 'ABC';
  const price = 10;

  return request(app)
    .post('/api/tickets')
    .set('Cookie', global.getCookie())
    .send({ title, price });
};

/**
 * Add new Ticket Tests  
 */

it('has a route handler listening to /api/tickets for POST requests', async () => {
  const response = await request(app)
    .post('/api/tickets')
    .send({});
  expect(response.status).not.toEqual(404);
});

it('Can only be accessed if the user is signed in', async () => {
  await request(app)
    .post('/api/tickets')
    .send({})
    .expect(401);
});

it('returns a status other than 401 if the user is signed in', async () => {
  const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', global.getCookie())
    .send({});
  expect(response.status).not.toEqual(401);
});

it('return an error if an invalid title is provided', async () => {
  await request(app)
    .post('/api/tickets')
    .set('Cookie', global.getCookie())
    .send({ title: '', price: 10 })
    .expect(400);

  await request(app)
    .post('/api/tickets')
    .set('Cookie', global.getCookie())
    .send({ price: 10 })
    .expect(400);
});

it('return an error if an invalid price is provided', async () => {
  await request(app)
    .post('/api/tickets')
    .set('Cookie', global.getCookie())
    .send({ title: 'abc', price: -10 })
    .expect(400);

  await request(app)
    .post('/api/tickets')
    .set('Cookie', global.getCookie())
    .send({ title: 'asd' })
    .expect(400);
});

it('creates a ticket with valid inputs', async () => {
  const title = 'ABC';
  const price = 10;

  let tickets = await Ticket.find({});
  expect(tickets.length).toEqual(0);

  await request(app)
    .post('/api/tickets')
    .set('Cookie', global.getCookie())
    .send({ title, price })
    .expect(201);

  tickets = await Ticket.find({});
  expect(tickets.length).toEqual(1);
  expect(tickets[0].title).toEqual(title);
  expect(tickets[0].price).toEqual(price);
});

it('creates a ticket with valid inputs and publishes event', async () => {
  const title = 'ABC';
  const price = 10;

  await request(app)
    .post('/api/tickets')
    .set('Cookie', global.getCookie())
    .send({ title, price })
    .expect(201);

  expect(natsWrapper.client.publish).toHaveBeenCalled();

});


/**
 * Get Ticket By id Tests  
 */

it('returns 404 if ticket is not found', async () => {
  const id = new mongoose.Types.ObjectId().toHexString();
  await request(app)
    .get(`/api/tickets/${id}`)
    .set('Cookie', global.getCookie())
    .send({})
    .expect(404);
});

it('Can only be accessed if the user is signed in', async () => {
  const id = new mongoose.Types.ObjectId().toHexString();
  await request(app)
    .get(`/api/tickets/${id}`)
    .send({})
    .expect(401);
});

it('returns a status other than 401 if the user is signed in', async () => {
  const id = new mongoose.Types.ObjectId().toHexString();
  const response = await request(app)
    .get(`/api/tickets/${id}`)
    .set('Cookie', global.getCookie())
    .send({});
  expect(response.status).not.toEqual(401);
});

it('returns the ticket with valid id', async () => {

  const response = await createTicket();
  const ticket = response.body;

  const retrievedTicket = await request(app)
    .get(`/api/tickets/${ticket.id}`)
    .set('Cookie', global.getCookie())
    .send({})
    .expect(200);
  expect(retrievedTicket.body.id).toEqual(ticket.id);
  expect(retrievedTicket.body.title).toEqual(ticket.title);
  expect(retrievedTicket.body.price).toEqual(ticket.price);

});


/**
 * Get All Tickets Tests  
 */
it('can fetch a list of tickets', async () => {
  const tickets = await Ticket.find({});
  expect(tickets.length).toEqual(0);

  await createTicket();
  await createTicket();
  await createTicket();

  const response = await request(app)
    .get('/api/tickets')
    .send({})
    .expect(200);
  expect(response.body.length).toEqual(3);
});


/**
 * Update Ticket Tests  
 */
it('returns a 404 if provided id does not exists', async () => {
  const id = new mongoose.Types.ObjectId().toHexString();
  await request(app)
    .put(`/api/tickets/${id}`)
    .set('Cookie', global.getCookie())
    .send({
      title: 'asdad',
      price: 10
    })
    .expect(404);
});

it('returns a 401 if user is not authenticated', async () => {
  const id = new mongoose.Types.ObjectId().toHexString();
  await request(app)
    .put(`/api/tickets/${id}`)
    .send({
      title: 'asdad',
      price: 10
    })
    .expect(401);
});

it('returns a 401 if the user does not own the ticket', async () => {
  const response = await createTicket();
  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', global.getCookie())
    .send({
      title: 'asdad',
      price: 10
    })
    .expect(401);
});

it('returns a 400 if the user provided an invalid title or price', async () => {
  const cookie = global.getCookie();
  const response = await request(app)
    .post(`/api/ticket`)
    .set('Cookie', cookie)
    .send({
      title: 'asdad',
      price: 10
    });
  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', cookie)
    .send({
      title: '',
      price: 10
    })
    .expect(400);
  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', cookie)
    .send({
      title: 'abcd',
      price: -10
    })
    .expect(400);
});

it('updates the ticket provided valid inputs', async () => {
  const cookie = global.getCookie();
  const response = await request(app)
    .post(`/api/tickets`)
    .set('Cookie', cookie)
    .send({
      title: 'asdad',
      price: 10
    });

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', cookie)
    .send({
      title: 'new title',
      price: 100
    })
    .expect(200);

  const ticketResponse = await request(app)
    .get(`/api/tickets/${response.body.id}`)
    .set('Cookie', cookie)
    .send({});

  expect(ticketResponse.body.title).toEqual('new title');
  expect(ticketResponse.body.price).toEqual(100);

});

it('updates the ticket provided valid inputs and publishes event', async () => {
  const cookie = global.getCookie();
  const response = await request(app)
    .post(`/api/tickets`)
    .set('Cookie', cookie)
    .send({
      title: 'asdad',
      price: 10
    });

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', cookie)
    .send({
      title: 'new title',
      price: 100
    })
    .expect(200);
  expect(natsWrapper.client.publish).toHaveBeenCalled();
});