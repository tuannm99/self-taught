import express, { Express, Request, Response } from 'express';
import helmet from 'helmet';
import cors from 'cors';

import {
  exceptionConverter,
  nextErr,
  exceptionHandler,
} from './libs/exception';
import logger from './libs/winston';
import { successLogger, errorLogger } from './libs/morgan';
import router from './controllers';

export default async () => {
  const app: Express = express();
  // midleware
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(helmet());

  app.use(cors({ origin: '*' })); // TODO

  app.use(successLogger);
  app.use(errorLogger);

  app.get(
    '/api/healthcheck',
    nextErr(async (_req: Request, res: Response) => {
      res.status(200).json({ msg: 'Hello World' });
    })
  );

  app.use('/api/v1', router);

  app.use(exceptionConverter);
  app.use(exceptionHandler);

  const port = process.env.PORT;
  app.listen(port, async () => {
    logger.info(`app running on port ${port}`);
  });
};
