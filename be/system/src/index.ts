import bootstrap from './app.init';
import { initialConsumers } from './consumer.init';
import { ProducerSingleton } from './libs/kafka';
import { kafkaLogger, dbLogger } from './libs/winston';
import { PostgresDataSource } from './models';

const { producer } = ProducerSingleton.getInstance();

producer.on('producer.connect', () => {
  kafkaLogger.info(`KafkaProvider: connected`);
});

producer.on('producer.disconnect', () => {
  kafkaLogger.info(`KafkaProvider: could not connect`);
});

producer.on('producer.network.request_timeout', (payload: any) => {
  kafkaLogger.info(`KafkaProvider: request timeout ${payload.clientId}`);
});

(async () => {
  try {
    await PostgresDataSource.initialize();
    dbLogger.info('db connected');
    await initialConsumers();

    await bootstrap();
  } catch (error) {
    dbLogger.error(error.toString());
  }
})();
