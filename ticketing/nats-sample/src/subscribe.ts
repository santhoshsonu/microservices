import nats, { Message } from 'node-nats-streaming';
import { randomBytes } from 'crypto';

console.clear();

const stan = nats.connect('ticketing-nats', randomBytes(4).toString('hex'), {
  url: 'http://localhost:4222'
});

stan.on('connect', () => {
  console.log('Listener connected to NATS');

  // The event will be delivered to exactly one 
  // random member of the Queue Group 
  // (**Very useful when scaling the service horizontally)
  const subscription = stan.subscribe('ticket:created', 'orders-service-queue-group');

  subscription.on('message', (msg: Message) => {
    const data = msg.getData();
    if (typeof (data) === 'string') {
      console.log(`Received event #${msg.getSequence()} with data: ${data}`);
    }
  });

});
