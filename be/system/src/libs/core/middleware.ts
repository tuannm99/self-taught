import morgan from 'morgan';
import { format } from 'date-and-time';
import { Request, Response } from 'express';
import logger from './logger';

morgan.token(
  'message',
  (_req: Request, res: Response) => res.locals.errorMessage || ''
);
morgan.token('mydate', () => format(new Date(), 'MM ddd,YYYY hh:mm:ss'));

const getIpFormat = () =>
  process.env.NODE_ENV === 'production' ? ':remote-addr - ' : '';
const successResponseFormat = ` ${getIpFormat()}:remote-user [:mydate] :method :url :status - :response-time ms`;
const errorResponseFormat = `${getIpFormat()}:remote-user [:mydate] :method :url :status - :response-time ms - message: :message`;

export const successHandler = morgan(successResponseFormat, {
  skip: (_req: Request, res: Response) =>
    res.statusCode >= 400 || process.env.NODE_ENV === 'test',
  stream: { write: (message) => logger.info(message.trim()) },
});

export const errorHandler = morgan(errorResponseFormat, {
  skip: (_req: Request, res: Response) =>
    res.statusCode < 400 || process.env.NODE_ENV === 'test',
  stream: { write: (message) => logger.error(message.trim()) },
});
