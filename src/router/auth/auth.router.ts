import {Router} from 'express';
import {authMiddleware, tokenMiddleware, userMiddleware} from '../../middleware';
import {authController} from '../../controller';
import {TokenActionEnum} from '../../constant';

const router = Router();

router.post(
  '/',
  authMiddleware.validateLoginInfo,
  userMiddleware.isUserExist,
  userMiddleware.isUserHasAccess,
  authController.authUser
);
router.post(
  '/logout',
  tokenMiddleware.checkTokenPresent,
  tokenMiddleware.verifyAndGetUserFromAuthToken(TokenActionEnum.AUTH_USER_ACCESS),
  authController.logoutUser
);
router.post(
  '/refresh',
  tokenMiddleware.checkTokenPresent,
  tokenMiddleware.verifyAndGetUserFromAuthToken(TokenActionEnum.AUTH_USER_REFRESH),
  authController.refreshToken
);

export const authRouter = router;
