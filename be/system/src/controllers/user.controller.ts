import { Request, Response, Router } from 'express';
import httpStatus from 'http-status';

import { buildResponseMessage } from '../libs/common';
import { PostgresDataSource, userRepo } from '../models';
import { ApiError, nextErr } from '../libs/exception';
import { checkAuth } from '../middlewares/auth';
import { AUTH_TYPES } from '../constants';
import { plainToInstance } from 'class-transformer';
import { User } from '../models/User';

const userRoutes = Router();

userRoutes.get(
  '/',
  checkAuth([AUTH_TYPES.BEARER]),
  nextErr(async (req: Request, res: Response) => {
    const users = await userRepo.find();
    return buildResponseMessage(httpStatus.OK, res, users);
  })
);

userRoutes.get(
  '/:id',
  nextErr(async (req: Request, res: Response) => {
    res.status(200).json({ msg: 'Login success' });
  })
);

userRoutes.post(
  '/',
  nextErr(async (req: Request, res: Response) => {
    res.status(200).json({ msg: 'Login success' });
  })
);

userRoutes.put(
  '/:id',
  nextErr(async (req: Request, res: Response) => {
    const { id } = req.params;

    const userExisted = await userRepo.findOneBy({ id: Number(id) });
    if (!userExisted) {
      throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
    }

    const user = plainToInstance(User, {
      ...userExisted,
      ...req.body,
      updatedAt: new Date(),
      updatedBy: id,
    });
    await user.checkUnameMail(Number(id));
    const inserted = await PostgresDataSource.manager.save(user);
    return buildResponseMessage(httpStatus.OK, res, inserted);
  })
);

userRoutes.delete(
  '/:id',
  nextErr(async (req: Request, res: Response) => {
    const { id } = req.params;
    return buildResponseMessage(httpStatus.OK, res, { id });
  })
);

export default userRoutes;
