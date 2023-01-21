import { registerConsumer } from './libs/kafka/consumer';
import { consumerFactories } from './consumers';

export const initialConsumers = async () => {
  await Promise.all([...(await registerConsumer(consumerFactories))]);
};
