const amqp = require('amqplib');

const options = {
  clientProperties: {
    connection_name: 'producer-service',
  },
};

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function consumer() {
  const queue = 'tasks';

  const connection = await amqp.connect('amqp://rabbitmquser:rabbitmqpassword@localhost', options);

  const channel = await connection.createChannel();

  await channel.assertQueue(queue, { durable: true });

  await channel.prefetch(100);

  channel.consume(queue, async (msg) => {
    try {
      if (!msg) {
        return console.log('Consumer cancelled by server');
      }

      console.log(JSON.parse(msg.content.toString()));
      await sleep(5000);
      console.log('fin');
      channel.ack(msg);

      // throw new Error('ERROR');
    } catch (error) {
      // channel.
      console.log('error');
    }
  });

  //   channel.consume('near', (msg) => {
  //     console.log(msg);
  //     console.log(msg.content.toString());

  //     // channel.ack(msg);
  //   });

  console.log('FIN');
}

consumer();
