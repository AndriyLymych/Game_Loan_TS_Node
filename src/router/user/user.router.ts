import {Router} from 'express';
import {userController} from '../../controller/user';
import {tokenMiddleware, userMiddleware} from '../../middleware';
import {TokenActionEnum} from '../../constant/token';

const router = Router();

router.post('/', userMiddleware.validateUser, userController.createUser);
router.put(
    '/confirm',
    tokenMiddleware.checkTokenPresentMiddleware,
    tokenMiddleware.verifyAndGetUserFromActionToken(TokenActionEnum.REGISTER_USER),
    userController.confirmUserAccount
);

export const userRouter = router;
