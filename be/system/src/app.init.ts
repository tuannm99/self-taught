import express, { Express, NextFunction, Request, Response } from 'express';
import helmet from 'helmet';
import cors from 'cors';

import {
  exceptionConverter,
  nextErr,
  exceptionHandler,
} from './libs/exception';
import { successLogger, errorLogger } from './libs/morgan';
import router from './controllers';
import logger from './libs/winston';

export default async () => {
  const app: Express = express();
  // midleware
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(helmet());
  app.use(cors({ origin: '*' }));
  app.use((_req: Request, res: Response, next: NextFunction) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'X-Requested-With');
    res.header('Cross-Origin-Resource-Policy', 'cross-origin');
    next();
  });
  app.use(successLogger);
  app.use(errorLogger);

  app.get(
    '/api/healthcheck',
    nextErr(async (_req: Request, res: Response) => {
      res.status(200).json({ msg: 'Hello World' });
    })
  );

  // app.post(
  //   '/api/v1/produce',
  //   globalExceptionHandler(async (req: Request, res: Response) => {
  //     const { msg }: { msg: string } = req.body;
  //     await produce({ topic: 'test-topic', messages: [{ value: msg }] });
  //     res.status(200).json({ msg: 'send msg to test-topic success' });
  //   })
  // );

  app.use('/api/v1', router);

  app.use(exceptionConverter);
  app.use(exceptionHandler);

  const port = process.env.PORT;
  app.listen(port, async () => {
    logger.info(`app running on port ${port}`);
  });
};
