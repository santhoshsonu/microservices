import nats from 'node-nats-streaming';
import { TicketCreatedPublisher } from './events/ticket-created-publisher';

console.clear();

const stan = nats.connect('ticketing-nats', 'abc', {
  url: 'http://localhost:4222'
});

stan.on('connect', async () => {
  console.log('Publisher connected to NATS');

  // NATS connection close handler
  stan.on('close', () => {
    console.log('Subscriber connection closed');
    process.exit();
  });

  const data = {
    id: '123',
    title: 'concert',
    price: 20
  };

  const publisher = new TicketCreatedPublisher(stan);
  try {
    await publisher.publish(data);
  } catch (error) {
    console.log(error);
  }

});

/**
 * Graceful shutdown
 * Process RESTART/KILL Event 
*/
process.on('SIGINT', () => stan.close());
process.on('SIGTERM', () => stan.close());