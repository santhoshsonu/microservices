import nats from 'node-nats-streaming';

console.clear();

const stan = nats.connect('ticketing-nats', 'abc', {
  url: 'http://localhost:4222'
});

stan.on('connect', () => {
  console.log('Publisher connected to NATS');

  // NATS connection close handler
  stan.on('close', () => {
    console.log('Subscriber connection closed');
    process.exit();
  });

  const data = JSON.stringify({
    id: '123',
    title: 'concert',
    price: 20
  });

  stan.publish('ticket:created', data, () => {
    console.log('Event published');
  });

});

/**
 * Graceful shutdown
 * Process RESTART/KILL Event 
*/
process.on('SIGINT', () => stan.close());
process.on('SIGTERM', () => stan.close());