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

export const userRouter = router;
