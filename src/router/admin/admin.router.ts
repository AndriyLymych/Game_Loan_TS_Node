import {Router} from 'express';
import {adminMiddleware, authMiddleware, tokenMiddleware, userMiddleware} from '../../middleware';
import {authController, userController} from '../../controller';
import {UserRoleEnum} from "../../constant/user";
import {TokenActionEnum} from "../../constant/token";

const router = Router();

router.post(
  '/',
  tokenMiddleware.checkTokenPresent,
  tokenMiddleware.verifyAndGetUserFromAuthToken(TokenActionEnum.AUTH_USER_ACCESS),
  adminMiddleware.isAdminChecker,
  userMiddleware.validateUser,
  userController.createUser(UserRoleEnum.ADMIN)
);

router.post(
  '/auth',
  authMiddleware.validateLoginInfo,
  userMiddleware.isUserExist,
  adminMiddleware.isAdminChecker,
  userMiddleware.isUserHasAccess,
  authController.authUser
);

export const adminRouter = router;
