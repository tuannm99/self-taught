import { EachMessagePayload } from 'kafkajs';
import { IConsumerFactory } from '../libs/kafka';

const consumerCallback1 = async (payload: EachMessagePayload) => {
  const { message, topic, partition } = payload;
  console.log('consumer1: ', message.value.toString());
};

export const consumerFactories: IConsumerFactory[] = [
  {
    topic: 'test-topic',
    callback: consumerCallback1,
    groupId: 'group1',
    // callbackConf: {},
  },
];
