import { plainToInstance } from 'class-transformer';
import { Request, Response, Router } from 'express';
import httpStatus from 'http-status';
import { buildResponseMessage } from '../libs/common';
import { PostgresDataSource } from '../libs/db';
import { User } from '../libs/db/User';
import { ApiError, globalExceptionHandler } from '../libs/exception';

const userRoutes = Router();

userRoutes.get(
  '/',
  // dtoValidationMiddleware(RefreshTokenDto),
  globalExceptionHandler(async (req: Request, res: Response) => {
    const users = await PostgresDataSource.createQueryBuilder()
      .select('user')
      .from(User, 'user')
      .getMany();
    return buildResponseMessage(res, users, httpStatus.OK);
  })
);

userRoutes.get(
  '/:id',
  // dtoValidationMiddleware(RefreshTokenDto),
  globalExceptionHandler(async (req: Request, res: Response) => {
    res.status(200).json({ msg: 'Login success' });
  })
);

userRoutes.post(
  '/',
  // dtoValidationMiddleware(RefreshTokenDto),
  globalExceptionHandler(async (req: Request, res: Response) => {
    res.status(200).json({ msg: 'Login success' });
  })
);

userRoutes.put(
  '/:id',
  // dtoValidationMiddleware(RefreshTokenDto),
  globalExceptionHandler(async (req: Request, res: Response) => {
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
    return buildResponseMessage(res, user, httpStatus.OK);
  })
);

userRoutes.delete(
  '/:id',
  // dtoValidationMiddleware(RefreshTokenDto),
  globalExceptionHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    res.status(200).json({ msg: 'Login success' });
  })
);

export default userRoutes;
