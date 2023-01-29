import { Producer, Partitioners, ProducerRecord } from 'kafkajs';

import { ApiError } from '../exception';
import { kafka } from '.';
import logger from '../winston';

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

    logger.info(`Publish: ${JSON.stringify({ ...producerRecord })}`);
    await producerInstance.producer.send({
      ...producerRecord,
    });
  } catch (e) {
    throw new ApiError(500, 'Publish event failed!!!', e.toString());
  }
};
