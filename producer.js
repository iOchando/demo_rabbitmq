const amqp = require('amqplib');

const options = {
  clientProperties: {
    connection_name: 'producer-service',
  },
};

async function publisher() {
  const queue = 'tasks';

  const connection = await amqp.connect('amqp://rabbitmquser:rabbitmqpassword@localhost', options);

  const channel = await connection.createChannel();

  await channel.assertQueue('queue');

  const data = {
    event: 'create-ticket',
    value: {
      title: 'name',
      description: 'description',
    },
  };

  setInterval(() => {
    console.log('send');
    channel.sendToQueue(queue, Buffer.from(JSON.stringify(data)), {
      persistent: true,
    });
  }, 1000);

  // for (let i = 0; i < 20; i++) {
  //   channel.sendToQueue(queue, Buffer.from(JSON.stringify(data)), {
  //     persistent: true,
  //   });
  // }

  console.log('FIN');
}

publisher();
