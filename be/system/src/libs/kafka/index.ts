import { Kafka, logLevel } from 'kafkajs';
import { kafkaLogger } from '../winston';

const toWinstonLogLevel = (level: number) => {
  switch (level) {
    case logLevel.ERROR:
    case logLevel.NOTHING:
      return 'error';
    case logLevel.WARN:
      return 'warn';
    case logLevel.INFO:
      return 'info';
    case logLevel.DEBUG:
      return 'debug';
  }
};

const WinstonLogCreator = (logLevel: logLevel) => {
  return ({ namespace, level, log }: any) => {
    kafkaLogger.log({
      level: toWinstonLogLevel(level),
      message: `${namespace} ${JSON.stringify(log)}`,
    });
  };
};

export const kafka = new Kafka({
  clientId: 'my-app',
  brokers: [process.env.KAFKA_BROKER_1],
  logCreator: WinstonLogCreator,
});
