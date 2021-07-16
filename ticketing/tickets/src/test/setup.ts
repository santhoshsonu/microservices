import { config as commonConfig } from '@microservice-tickets/common';
import jwt from 'jsonwebtoken';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';

declare global {
  namespace NodeJS {
    interface Global {
      getCookie(): string[];
    }
  }
}

let mongo: MongoMemoryServer;
beforeAll(async () => {
  commonConfig.JWT_KEY = 'asdadadawadw';

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
global.getCookie = () => {
  // Build JWT payload { id, email }
  const payload = {
    id: '1234567889',
    email: 'test@ticketing.microservices.com'
  };

  // Create JWT
  const token = jwt.sign(payload, commonConfig.JWT_KEY!);

  // Build session Object { jwt: JWT_TOKEN }
  const session = { jwt: token };

  // Turn that session into JSON
  const sessionJSON = JSON.stringify(session);

  // Take JSON and encode it as base64
  const base64 = Buffer.from(sessionJSON).toString('base64');

  // Return a string thats the cookie with encoded data
  return [`express:sess=${base64}`];
}