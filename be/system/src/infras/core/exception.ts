import { Request, Response, NextFunction } from 'express';
import httpStatus from 'http-status';
import mongoose from 'mongoose';
import logger from './logger';

export class ApiError extends Error {
  msg: string;
  stack: string;
  statusCode: number;

  constructor(statusCode: number, msg?: string, stack: string = '') {
    super();
    this.msg = msg;
    this.statusCode = statusCode;
    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export const globalExceptionHandler =
  (fn: Function) => (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch((err: ApiError) => next(err));
  };

export const errorConverter = (
  err: ApiError,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  let error = err;
  if (!(error instanceof ApiError)) {
    const statusCode: number =
      err.statusCode ||
      (err instanceof mongoose.Error
        ? httpStatus.BAD_REQUEST
        : httpStatus.INTERNAL_SERVER_ERROR);
    const msg = err.msg || httpStatus[statusCode];
    error = new ApiError(statusCode, msg, err.stack);
  }

  const { statusCode, msg } = error;
  res.locals.errorMessage = err.msg;

  logger.error(msg);
  const response = {
    code: statusCode,
    message: msg,
    trace: err.stack,
  };

  res.status(statusCode).json(response);
};

