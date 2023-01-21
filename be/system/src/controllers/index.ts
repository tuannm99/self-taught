import { Router } from 'express';
import userController from './user.controller';
import authController from './auth.controller';

const router = Router();

router.use('/users', userController);
router.use('/auth', authController);

export default router;
