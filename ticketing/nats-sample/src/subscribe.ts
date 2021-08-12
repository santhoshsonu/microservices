import { randomBytes } from 'crypto';
import nats from 'node-nats-streaming';
import { TicketCreatedListener } from './events/ticket-created-listener';

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

  new TicketCreatedListener(stan).listen();

});

/**
 * Graceful shutdown
 * Process RESTART/KILL Event 
*/
process.on('SIGINT', () => stan.close());
process.on('SIGTERM', () => stan.close());
