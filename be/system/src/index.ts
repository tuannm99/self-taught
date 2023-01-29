import bootstrap from './app.init';
import { initialConsumers } from './consumer.init';
import { ProducerSingleton } from './libs/kafka';
import logger from './libs/winston';
import { PostgresDataSource } from './models';

const { producer } = ProducerSingleton.getInstance();

producer.on('producer.connect', () => {
  logger.info(`KafkaProvider: connected`);
});

producer.on('producer.disconnect', () => {
  logger.info(`KafkaProvider: could not connect`);
});

producer.on('producer.network.request_timeout', (payload: any) => {
  logger.info(`KafkaProvider: request timeout ${payload.clientId}`);
});

(async () => {
  try {
    await PostgresDataSource.initialize();
    logger.info('db connected');
    await initialConsumers();

    await bootstrap();
  } catch (error) {
    logger.error(error.toString());
  }
})();
