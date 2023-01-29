import { NextFunction, Request, RequestHandler, Response } from 'express';
import httpStatus from 'http-status';
import mongoose from 'mongoose';
import { TypeORMError } from 'typeorm';

import { sanitize } from 'class-sanitizer';
import { plainToInstance } from 'class-transformer';
import { validate, ValidationError } from 'class-validator';
import logger from './winston';

export class ApiError extends Error {
  msg: any;
  stack: string;
  statusCode: number;

  constructor(statusCode: number, msg?: any, stack = '') {
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

type ResolveErr = (req: Request, res: Response, next: NextFunction) => void;
export const nextErr =
  (fn: ResolveErr) => (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch((err: ApiError) => next(err));
  };

export const exceptionConverter = (
  err: ApiError,
  _req: Request,
  _res: Response,
  next: NextFunction
) => {
  let error = err;
  if (!(error instanceof ApiError)) {
    const statusCode: number =
      err.statusCode ||
      (err instanceof mongoose.Error || err instanceof TypeORMError
        ? httpStatus.BAD_REQUEST
        : httpStatus.INTERNAL_SERVER_ERROR);
    const msg = err.msg || httpStatus[statusCode];
    error = new ApiError(statusCode, msg, err.stack);
  }

  next(error);
};

export const exceptionHandler = (
  err: ApiError,
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  const { statusCode, msg } = err;

  const response = {
    code: statusCode,
    message: msg,
    stack: err.stack,
  };

  logger.error(`${msg}${err.stack !== 'Error' ? ` - ${err.stack}` : ''}`);

  res.status(statusCode).send(response);
  next();
};

export function dtoValidation(
  type: any,
  skipMissingProperties = false
): RequestHandler {
  return (req: Request, res: Response, next: NextFunction) => {
    const dtoObj = plainToInstance(type, req.body);
    validate(dtoObj, { skipMissingProperties }).then(
      (errors: ValidationError[]) => {
        if (errors.length > 0) {
          const dtoErrors = errors.map((error: ValidationError) =>
            (Object as any).values(error.constraints)
          );
          next(new ApiError(httpStatus.BAD_REQUEST, dtoErrors));
        } else {
          //sanitize the object and call the next middleware
          sanitize(dtoObj);
          req.body = dtoObj;
          next();
        }
      }
    );
  };
}

export const validateEntity = async (entity: any) => {
  const errors = await validate(entity);
  if (errors.length > 0) {
    const dtoErrors = errors.map((error: ValidationError) =>
      (Object as any).values(error.constraints)
    );
    throw new ApiError(httpStatus.BAD_REQUEST, dtoErrors);
  }
};
