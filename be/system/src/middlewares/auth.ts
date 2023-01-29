import { NextFunction, Request, RequestHandler, Response } from 'express';
import jwt from 'jsonwebtoken';
import httpStatus from 'http-status';

import { ApiError } from '../libs/exception';
import { userRepo } from '../models';
import { nextErr } from '../libs/exception';
import { AUTH_TYPES } from '../constants';

export function checkAuth(
  authStrategy: Array<string>, // define applied method for authentication
  roles?: Array<any>
): RequestHandler {
  console.log(roles);
  return nextErr(async (req: Request, _res: Response, next: NextFunction) => {
    const { authorization } = req.headers;

    if (!authorization) {
      throw new ApiError(httpStatus.UNAUTHORIZED, 'missing token');
    }

    const [type, token] = authorization.split(' ');
    if (!authStrategy.includes(type)) {
      throw new ApiError(
        httpStatus.UNAUTHORIZED,
        `auth type: ${type} not exist for this route`
      );
    }

    const currentAuthStrategy = authTypes.get(type);

    if (!currentAuthStrategy) {
      throw new ApiError(
        httpStatus.UNAUTHORIZED,
        `No Strategy of authentication: ${type}`
      );
    }
    await currentAuthStrategy(token);

    next();
  });
}

const bearerStrategy = async (token: string) => {
  if (!token) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Token not found');
  }

  try {
    const { userId, iat }: any = jwt.verify(token, process.env.SECRET_TOKEN);

    if (iat <= Date.now()) {
      throw new ApiError(httpStatus.UNAUTHORIZED, 'Token Expried');
    }

    const user = await userRepo.findOneBy({ id: userId });
    if (!user) {
      throw new ApiError(httpStatus.UNAUTHORIZED, 'Token not valid');
    }
  } catch (error) {
    throw new ApiError(httpStatus.UNAUTHORIZED, error.msg);
  }
};

type authCallBack = (type: string) => Promise<void>;
const authTypes = new Map<string, authCallBack>();
authTypes.set(AUTH_TYPES.BEARER, bearerStrategy);
authTypes.set(AUTH_TYPES.DIGEST, bearerStrategy); // TODO:
authTypes.set(AUTH_TYPES.BASIC, bearerStrategy); // TODO:
// other
