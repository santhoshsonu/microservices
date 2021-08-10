import nats, { Message } from 'node-nats-streaming';
import { randomBytes } from 'crypto';

console.clear();

const stan = nats.connect('ticketing-nats', randomBytes(4).toString('hex'), {
  url: 'http://localhost:4222'
});

stan.on('connect', () => {
  console.log('Subscriber connected to NATS');

  // NATS connection close handler
  stan.on('close', () => {
    console.log('Subscriber connection closed');
    process.exit();
  });

  const options = stan.subscriptionOptions()
    .setManualAckMode(true)
    .setDeliverAllAvailable()
    .setDurableName('order-service');

  /**
   * The event will be delivered to exactly one 
   * random member of the Queue Group 
   * (Very useful when scaling the service horizontally)
  */
  const subscription = stan.subscribe('ticket:created',
    'orders-service-queue-group',
    options);

  subscription.on('message', (msg: Message) => {
    const data = msg.getData();
    if (typeof (data) === 'string') {
      console.log(`Received event #${msg.getSequence()} with data: ${data}`);
    }
    // Acknowledge that msg is processed
    msg.ack();
  });

});

/**
 * Graceful shutdown
 * Process RESTART/KILL Event 
*/
process.on('SIGINT', () => stan.close());
process.on('SIGTERM', () => stan.close());
