import { Router, Request, Response } from 'express';
import httpStatus from 'http-status';

import { ApiError, dtoValidation, nextErr } from '../libs/exception';
import { PostgresDataSource, tokenRepo, userRepo } from '../models';
import { LoginDto, RefreshTokenDto, RegisterDto } from './dtos/auth.dto';
import {
  buildResponseMessage,
  generateSalt,
  hashStr,
  isHashedMatch,
} from '../libs/common';
import { generateToken } from '../commons';
import { plainToInstance } from 'class-transformer';
import { User } from '../models/User';

const authRoutes = Router();

authRoutes.post(
  '/login',
  dtoValidation(LoginDto),
  nextErr(async (req: Request, res: Response) => {
    const { username, password }: LoginDto = req.body;
    const user = await userRepo.findOneBy({ username });
    if (!user) {
      throw new ApiError(httpStatus.NOT_FOUND, 'username not existed');
    }

    const isPasswordMatch = await isHashedMatch(password, user.password);
    if (!isPasswordMatch) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'password not match');
    }

    const token = await generateToken(user.id);

    return buildResponseMessage(httpStatus.OK, res, token);
  })
);

authRoutes.post(
  '/register',
  dtoValidation(RegisterDto),
  nextErr(async (req: Request, res: Response) => {
    const salt = await generateSalt();
    const password = await hashStr(req.body.password, salt);
    const user = plainToInstance(User, {
      ...req.body,
      password,
      isCustomer: true,
    });
    await user.checkUnameMail();
    const inserted = await PostgresDataSource.manager.save(user);
    return buildResponseMessage(httpStatus.OK, res, inserted);
  })
);

authRoutes.get(
  '/refresh-token',
  dtoValidation(RefreshTokenDto),
  nextErr(async (req: Request, res: Response) => {
    const { refreshToken } = req.body;
    const rToken = await tokenRepo.findOneBy({ refreshToken });
    if (!rToken) {
      throw new ApiError(httpStatus.NOT_FOUND, `token not found`);
    }
    const { iat, userId } = rToken;
    if (iat <= Date.now()) {
      throw new ApiError(httpStatus.UNAUTHORIZED, `refresh token expired`);
    }

    const updated = await generateToken(userId, true);
    return buildResponseMessage(httpStatus.OK, res, updated);
  })
);

/**
 * check permission of user
 * using redis with lru cached strategy
 */
authRoutes.post(
  '/perm',
  nextErr(async (req: Request, res: Response) => {
    return buildResponseMessage(httpStatus.OK, res, { ok: 'ok' });
  })
);

export default authRoutes;
