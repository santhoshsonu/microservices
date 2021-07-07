import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import request from 'supertest';
import { app } from '../app';
import { config } from '../config/config';

declare global {
  namespace NodeJS {
    interface Global {
      getCookie(): Promise<string[]>;
    }
  }
}

let mongo: MongoMemoryServer;
beforeAll(async () => {
  config.JWT_KEY = 'asdadadawadw';

  mongo = new MongoMemoryServer();
  const mongoUri = await mongo.getUri();

  await mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });

});

beforeEach(async () => {
  const collections = await mongoose.connection.db.collections();

  for (let collection of collections) {
    await collection.deleteMany({});
  }

});

afterAll(async () => {
  await mongo.stop();
  await mongoose.connection.close();
});

// Auth helper
global.getCookie = async () => {
  const email = 'test@microservices.ticketing.com';
  const password = 'test';

  const authResponse = await request(app)
    .post('/api/users/signup')
    .send({
      email, password
    })
    .expect(201);

  const cookie = authResponse.get('Set-Cookie');
  return cookie;
}