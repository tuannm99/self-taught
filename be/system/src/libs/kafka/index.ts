import { Kafka } from 'kafkajs';

export const kafka = new Kafka({
  clientId: 'my-app',
  brokers: [process.env.KAFKA_BROKER_1],
});

