import request from 'supertest';
import { app } from '../../app';
import { signIn } from '../../controllers/auth-controller';

/**
 *  Sign Up Tests
 */
it('returns a 201 on successful signup', async () => {
  await request(app)
    .post('/api/users/signup')
    .send({
      "email": "test@microservices.ticketing.com",
      "password": "test"
    })
    .expect(201);
});

it('returns a 400 with invalid email', async () => {
  await request(app)
    .post('/api/users/signup')
    .send({
      "email": "testdasdad",
      "password": "test"
    })
    .expect(400);
});

it('returns a 400 with invalid password', async () => {
  await request(app)
    .post('/api/users/signup')
    .send({
      "email": "testdasdad",
      "password": "p"
    })
    .expect(400);
});

it('returns a 400 with missing email and password', async () => {
  await request(app)
    .post('/api/users/signup')
    .send({
      email: 'test@microservices.ticketing.com'
    })
    .expect(400);

  await request(app)
    .post('/api/users/signup')
    .send({
      password: 'test'
    })
    .expect(400);
});

it('returns a 400 with duplicate email', async () => {
  await request(app)
    .post('/api/users/signup')
    .send({
      email: 'test@microservices.ticketing.com',
      password: 'test'
    })
    .expect(201);

  await request(app)
    .post('/api/users/signup')
    .send({
      email: 'test@microservices.ticketing.com',
      password: 'test'
    })
    .expect(400);
});

it('sets a cookie after successful signup', async () => {
  const response = await request(app)
    .post('/api/users/signup')
    .send({
      email: 'test@microservices.ticketing.com',
      password: 'test'
    })
    .expect(201);

  expect(response.get('Set-Cookie')).toBeDefined();

});

/**
 *  Sign In Tests
 */
it('returns a 400 when a email that does not exists is supplied', async () => {
  await request(app)
    .post('/api/users/signin')
    .send({
      "email": "test@microservices.ticketing.com",
      "password": "test"
    })
    .expect(400);
});

it('returns a 400 when an incorrect password is supplied', async () => {
  await request(app)
    .post('/api/users/signup')
    .send({
      "email": "test@microservices.ticketing.com",
      "password": "test"
    })
    .expect(201);

  await request(app)
    .post('/api/users/signin')
    .send({
      "email": "test@microservices.ticketing.com",
      "password": "test12"
    })
    .expect(400);
});

it('responds with a cookie when valid credentials are given', async () => {
  await request(app)
    .post('/api/users/signup')
    .send({
      "email": "test@microservices.ticketing.com",
      "password": "test"
    })
    .expect(201);

  const response = await request(app)
    .post('/api/users/signin')
    .send({
      "email": "test@microservices.ticketing.com",
      "password": "test"
    })
    .expect(200);

  expect(response.get('Set-Cookie')).toBeDefined();
});

/**
 *  Sign Out Tests
 */
it('clears the cookie after signing out', async () => {
  await request(app)
    .post('/api/users/signup')
    .send({
      "email": "test@microservices.ticketing.com",
      "password": "test"
    })
    .expect(201);

  const response = await request(app)
    .post('/api/users/signout')
    .send({})
    .expect(200);

  expect(response.get('Set-Cookie')[0]).toEqual(
    'express:sess=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; httponly'
  );
});

/**
 *  CurrentUser Tests
 */
it('responds with details about the current user', async () => {
  const cookie = await global.getCookie();
  const response = await request(app)
    .get('/api/users/currentuser')
    .set('Cookie', cookie)
    .send()
    .expect(200);

  expect(response.body.currentUser.email)
    .toEqual('test@microservices.ticketing.com');
});

it('responds with currentUser as null if not authenticated', async () => {
  const response = await request(app)
    .get('/api/users/currentuser')
    .send()
    .expect(200);

  expect(response.body.currentUser)
    .toEqual(null);
});