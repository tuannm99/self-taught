import morgan from 'morgan';
import { Request, Response } from 'express';
import { morganLogger as logger } from './winston';

morgan.token(
  'message',
  (_req: Request, res: Response) => res.locals.errorMessage || ''
);

const successResponseFormat = `:method :url :status - :response-time ms`;
const errorResponseFormat = `:method :url :status - :response-time ms - message: :message`;

export const successLogger = morgan(successResponseFormat, {
  skip: (_req: Request, res: Response) =>
    res.statusCode >= 400 || process.env.NODE_ENV === 'test',
  stream: { write: (message) => logger.http(message.trim()) },
});

export const errorLogger = morgan(errorResponseFormat, {
  skip: (_req: Request, res: Response) =>
    res.statusCode < 400 || process.env.NODE_ENV === 'test',
  stream: { write: (message) => logger.error(message.trim()) },
});
