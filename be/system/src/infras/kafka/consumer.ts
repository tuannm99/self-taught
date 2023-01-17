import { v4 as uuidv4 } from 'uuid';

import { ConsumerRunConfig, EachMessagePayload } from 'kafkajs';
import { kafka } from '.';
import logger from '../core/logger';

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
                logger.info('Restart Onfailure');
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
