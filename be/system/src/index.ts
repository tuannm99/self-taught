import express, { Express, NextFunction, Request, Response } from 'express';
import helmet from 'helmet';
import cors from 'cors';

import { errorConverter, globalExceptionHandler } from './libs/core/exception';
import logger from './libs/core/logger';
import { successHandler, errorHandler } from './libs/core/middleware';

import { ProducerSingleton, produce } from './libs/kafka/producer';
import { initialConsumers } from './initConsumer';

const bootstrap = async () => {
  const app: Express = express();
  // midleware
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(helmet());
  app.use(cors({ origin: '*' }));
  app.use(function (_req: Request, res: Response, next: NextFunction) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'X-Requested-With');
    res.header('Cross-Origin-Resource-Policy', 'cross-origin');
    next();
  });
  app.use(successHandler);
  app.use(errorHandler);

  await initialConsumers();

  const producer = ProducerSingleton.getInstance().producer;

  producer.on('producer.connect', () => {
    console.log(`KafkaProvider: connected`);
  });

  producer.on('producer.disconnect', () => {
    console.log(`KafkaProvider: could not connect`);
  });

  producer.on('producer.network.request_timeout', (payload: any) => {
    console.log(`KafkaProvider: request timeout ${payload.clientId}`);
  });

  app.get(
    '/healthcheck',
    globalExceptionHandler(
      async (_req: Request, res: Response, _next: NextFunction) => {
        res.status(200).json({ msg: 'Hello World' });
      }
    )
  );

  app.post(
    '/produce',
    globalExceptionHandler(
      async (req: Request, res: Response, _next: NextFunction) => {
        const { msg }: { msg: string } = req.body;
        await produce({ topic: 'test-topic', messages: [{ value: msg }] });
        res.status(200).json({ msg: 'send msg to test-topic success' });
      }
    )
  );

  app.use(errorConverter);
  // app.use(errorHandler);

  const port = process.env.PORT;
  app.listen(port, async () => {
    logger.info(`app running on port ${port}`);
  });
};

(async () => {
  await bootstrap();
})();
