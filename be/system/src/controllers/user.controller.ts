import { plainToInstance } from 'class-transformer';
import { Request, Response, Router } from 'express';
import httpStatus from 'http-status';
import { buildResponseMessage } from '../libs/common';
import { PostgresDataSource } from '../models';
import { User } from '../models/User';
import { ApiError, nextErr } from '../libs/exception';

const userRoutes = Router();

userRoutes.get(
  '/',
  // dtoValidationMiddleware(RefreshTokenDto),
  nextErr(async (req: Request, res: Response) => {
    const users = await PostgresDataSource.createQueryBuilder()
      .select('user')
      .from(User, 'user')
      .getMany();
    return buildResponseMessage(httpStatus.OK, res, users);
  })
);

userRoutes.get(
  '/:id',
  // dtoValidationMiddleware(RefreshTokenDto),
  nextErr(async (req: Request, res: Response) => {
    res.status(200).json({ msg: 'Login success' });
  })
);

userRoutes.post(
  '/',
  // dtoValidationMiddleware(RefreshTokenDto),
  nextErr(async (req: Request, res: Response) => {
    res.status(200).json({ msg: 'Login success' });
  })
);

userRoutes.put(
  '/:id',
  // dtoValidationMiddleware(RefreshTokenDto),
  nextErr(async (req: Request, res: Response) => {
    const { id } = req.params;
    const { email } = req.body;

    const userExisted = await PostgresDataSource.createQueryBuilder()
      .select('user')
      .from(User, 'user')
      .where('user.id = :id', { id })
      .getOne();

    if (!userExisted) {
      throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
    }

    const isEmailExisted =
      (await PostgresDataSource.createQueryBuilder()
        .select('user')
        .from(User, 'user')
        .where('user.email = :email', { email })
        .andWhere('id != :id', { id })
        .getCount()) > 0;

    if (isEmailExisted) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Email is existed');
    }
    const user = plainToInstance(User, { ...userExisted, ...req.body });
    user.updatedAt = new Date();
    user.updatedBy = id;
    await PostgresDataSource.manager.save(user);
    return buildResponseMessage(httpStatus.OK, res, user);
  })
);

userRoutes.delete(
  '/:id',
  // dtoValidationMiddleware(RefreshTokenDto),
  nextErr(async (req: Request, res: Response) => {
    const { id } = req.params;
    return buildResponseMessage(httpStatus.OK, res, { id });
  })
);

export default userRoutes;
