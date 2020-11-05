import {Router} from 'express';
import {userController} from '../../controller';
import {tokenMiddleware, userMiddleware} from '../../middleware';
import {TokenActionEnum} from '../../constant';

const router = Router();

router.post('/', userMiddleware.validateUser, userController.createUser);
router.put(
  '/confirm',
  tokenMiddleware.checkTokenPresent,
  tokenMiddleware.verifyAndGetUserFromActionToken(TokenActionEnum.REGISTER_USER),
  userController.confirmUserAccount
);
router.put(
  '/password',
  tokenMiddleware.checkTokenPresent,
  tokenMiddleware.verifyAndGetUserFromAuthToken(TokenActionEnum.AUTH_USER_ACCESS),
  userMiddleware.validateChangePassword,
  userController.changePassword
);

export const userRouter = router;
