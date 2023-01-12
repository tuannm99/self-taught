import {  EachMessagePayload } from 'kafkajs';
import { IConsumerFactory } from '../libs/kafka/consumer';

const consumerCallback1 = async (payload: EachMessagePayload) => {
  const { message, topic, partition } = payload;
  console.log('consumer1: ', message.value.toString());
};

const consumerCallback2 = async (payload: EachMessagePayload) => {
  const { message, topic, partition } = payload;
  console.log('consumer2: ', message.value.toString());
};

const consumerCallback3 = async (payload: EachMessagePayload) => {
  const { message, topic, partition } = payload;
  console.log('consumer3: ', message.value.toString());
};

export const consumerFactories: IConsumerFactory[] = [
  {
    topic: 'test-topic',
    callback: consumerCallback1,
    groupId: 'group1',
    // callbackConf: {},
  },
  {
    topic: 'test-topic',
    callback: consumerCallback2,
    groupId: 'group2',
    // callbackConf: {},
  },
  {
    topic: 'test-topic',
    callback: consumerCallback3,
    groupId: 'group3',
    // callbackConf: {},
  },
  {
    topic: 'test-topic',
    callback: consumerCallback3,
    groupId: 'group4',
    // callbackConf: {},
  },
  {
    topic: 'test-topic',
    callback: consumerCallback3,
    groupId: 'group5',
  },
];
