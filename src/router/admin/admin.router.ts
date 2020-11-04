import {Router} from 'express';
import {adminMiddleware,userMiddleware} from '../../middleware';
import {userController} from '../../controller';

const router = Router();

router.post(
  '/',
  userMiddleware.validateUser,
  userMiddleware.isUserExist,
  adminMiddleware.isAdminChecker,
  userMiddleware.isUserHasAccess,
  userController.createUser
);

export const adminRouter = router;
