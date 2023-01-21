import { Router, Request, Response, NextFunction } from 'express';
import httpStatus from 'http-status';
import { plainToInstance } from 'class-transformer';

import {
  dtoValidationMiddleware,
  globalExceptionHandler,
} from '../libs/exception';
import { PostgresDataSource } from '../libs/db';
import { User } from '../libs/db/User';
import { LoginDto, RefreshTokenDto, RegisterDto } from './dtos/auth.dto';
import { buildResponseMessage } from '../libs/common';

const authRoutes = Router();

authRoutes.post(
  '/login',
  dtoValidationMiddleware(LoginDto),
  globalExceptionHandler(async (req: Request, res: Response) => {
    const { username, password }: LoginDto = req.body;

    const user = await PostgresDataSource.createQueryBuilder()
      .select('user')
      .from(User, 'user')
      .where('user.username = :username', { username })
      .getOne();

    return buildResponseMessage(res, user, httpStatus.OK);
  })
);

authRoutes.post(
  '/register',
  dtoValidationMiddleware(RegisterDto),
  globalExceptionHandler(async (req: Request, res: Response) => {
    const user = plainToInstance(User, req.body);
    user.isCustomer = true;
    await PostgresDataSource.manager.save(user);
    return buildResponseMessage(res, user, httpStatus.OK);
  })
);

authRoutes.get(
  '/refresh-token',
  dtoValidationMiddleware(RefreshTokenDto),
  globalExceptionHandler(async (req: Request, res: Response) => {
    res.status(200).json({ msg: 'Login success' });
  })
);

export default authRoutes;
