import { Router, Request, Response, NextFunction } from 'express';
import httpStatus from 'http-status';
import { plainToInstance } from 'class-transformer';
import passport from 'passport';

import { ApiError, dtoValidation, nextErr } from '../libs/exception';
import { PostgresDataSource } from '../models';
import { User } from '../models/User';
import { LoginDto, RefreshTokenDto, RegisterDto } from './dtos/auth.dto';
import {
  buildResponseMessage,
  generateSalt,
  hashStr,
  isHashedMatch,
} from '../libs/common';

const authRoutes = Router();

authRoutes.post(
  '/login',
  passport.authenticate('jwt', { session: false }),
  dtoValidation(LoginDto),
  nextErr(async (req: Request, res: Response) => {
    const { username, password }: LoginDto = req.body;
    const user = await PostgresDataSource.createQueryBuilder()
      .select('user')
      .from(User, 'user')
      .where('user.username = :username', { username })
      .getOne();
    if (!user) {
      throw new ApiError(httpStatus.NOT_FOUND, 'username not existed');
    }

    const isPasswordMatch = await isHashedMatch(password, user.password);
    if (!isPasswordMatch) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'password not match');
    }

    // const token = jwt.sign({ username: user.username }, '123@123ab', {
    //   algorithm: 'RS256',
    // });

    return buildResponseMessage(httpStatus.OK, res, user);
  })
);

authRoutes.post(
  '/register',
  dtoValidation(RegisterDto),
  nextErr(async (req: Request, res: Response) => {
    const user = plainToInstance(User, req.body);
    user.isCustomer = true;
    const salt = await generateSalt();
    user.password = await hashStr(req.body.password, salt);
    await PostgresDataSource.manager.save(user);
    return buildResponseMessage(httpStatus.OK, res, user);
  })
);

authRoutes.get(
  '/refresh-token',
  dtoValidation(RefreshTokenDto),
  nextErr(async (req: Request, res: Response) => {
    res.status(200).json({ msg: 'Login success' });
  })
);

export default authRoutes;
