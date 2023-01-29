import { v4 as uuidv4 } from 'uuid';
import {
  Kafka,
  logLevel,
  ConsumerRunConfig,
  EachMessagePayload,
  Producer,
  Partitioners,
  ProducerRecord,
} from 'kafkajs';
import { kafkaLogger } from './winston';
import { ApiError } from './exception';

// -------------------------------------- log config
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

// -------------------------------------- kafka instance
export const kafka = new Kafka({
  clientId: 'my-app',
  brokers: [process.env.KAFKA_BROKER_1],
  logCreator: WinstonLogCreator,
});

// -------------------------------------- consumer
export interface IConsumerFactory {
  topic: string;
  groupId?: string;
  callback: (payload: EachMessagePayload) => Promise<void>;
  callbackConf?: ConsumerRunConfig;
}

export const registerConsumer = async (
  consumerFactories: IConsumerFactory[]
) => {
  const runConsumers: Promise<void>[] = [];
  consumerFactories.forEach((consumerConf) => {
    runConsumers.push(
      (async () => {
        let consumer;
        try {
          const { topic, groupId, callback, callbackConf } = consumerConf;
          consumer = kafka.consumer({
            groupId: groupId || uuidv4(), // if not specify groupId set random
            sessionTimeout: 10000,
            retry: {
              initialRetryTime: 3,
              maxRetryTime: 5,
              retries: 3,
              restartOnFailure: async (e) => {
                kafkaLogger.error('Restart Onfailure');
                throw e;
              },
            },
          });

          await consumer.connect();
          await consumer.subscribe({ topic, fromBeginning: false });
          await consumer.run({ ...callbackConf, eachMessage: callback });
        } catch (e) {
          await consumer.disconnect();
          throw e;
        }
      })()
    );
  });
  return runConsumers;
};

// -------------------------------------- producer
/**
 * Producer is Singleton
 */
export class ProducerSingleton {
  private static instance: ProducerSingleton;
  private _producer: Producer;
  private _isConnected = false;

  private constructor() {
    this._producer = kafka.producer({
      createPartitioner: Partitioners.LegacyPartitioner,
    });
  }

  public static getInstance(): ProducerSingleton {
    if (!ProducerSingleton.instance) {
      ProducerSingleton.instance = new ProducerSingleton();
    }

    return ProducerSingleton.instance;
  }

  public get isConnected() {
    return this._isConnected;
  }

  async connect(): Promise<void> {
    try {
      await this._producer.connect();
      this._isConnected = true;
    } catch (err) {
      console.error(err);
    }
  }

  get producer() {
    return this._producer;
  }
}

export const produce = async (producerRecord: ProducerRecord) => {
  try {
    const producerInstance = ProducerSingleton.getInstance();
    if (!producerInstance.isConnected) {
      await producerInstance.connect();
    }

    kafkaLogger.info(`Publish: ${JSON.stringify({ ...producerRecord })}`);
    await producerInstance.producer.send({
      ...producerRecord,
    });
  } catch (e) {
    throw new ApiError(500, 'Publish event failed!!!', e.toString());
  }
};
