import bootstrap from './app.init';
import { initialConsumers } from './consumer.init';
import { ProducerSingleton } from './libs/kafka/producer';
import { PostgresDataSource } from './models';

const { producer } = ProducerSingleton.getInstance();

producer.on('producer.connect', () => {
  console.log(`KafkaProvider: connected`);
});

producer.on('producer.disconnect', () => {
  console.log(`KafkaProvider: could not connect`);
});

producer.on('producer.network.request_timeout', (payload: any) => {
  console.log(`KafkaProvider: request timeout ${payload.clientId}`);
});

(async () => {
  try {
    await PostgresDataSource.initialize();
    console.log('db connected');
    await initialConsumers();

    await bootstrap();
  } catch (error) {
    console.error(error);
  }
})();
