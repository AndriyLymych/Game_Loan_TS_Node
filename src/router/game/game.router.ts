import {Router} from 'express';
import {adminMiddleware, tokenMiddleware, gameMiddleware} from '../../middleware';
import {gameController} from '../../controller';
import {TokenActionEnum} from '../../constant';

const router = Router();

router.post(
    '/',
    tokenMiddleware.checkTokenPresent,
    tokenMiddleware.verifyAndGetUserFromAuthToken(TokenActionEnum.AUTH_USER_ACCESS),
    adminMiddleware.isAdminChecker,
    gameMiddleware.validateGame,
    gameController.addGame
);

export const gameRouter = router;
