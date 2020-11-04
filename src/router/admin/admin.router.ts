import {Router} from 'express';
import {adminMiddleware, authMiddleware, tokenMiddleware, userMiddleware} from '../../middleware';
import {adminController, authController, userController} from '../../controller';
import {UserRoleEnum} from '../../constant/user';
import {TokenActionEnum} from '../../constant/token';

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
router.put(
  '/block/:id',
  tokenMiddleware.checkTokenPresent,
  tokenMiddleware.verifyAndGetUserFromAuthToken(TokenActionEnum.AUTH_USER_ACCESS),
  adminMiddleware.isAdminChecker,
  adminController.blockUser
);
router.put(
  '/unlock/:id',
  tokenMiddleware.checkTokenPresent,
  tokenMiddleware.verifyAndGetUserFromAuthToken(TokenActionEnum.AUTH_USER_ACCESS),
  adminMiddleware.isAdminChecker,
  adminController.unlockUser
);

export const adminRouter = router;
