import {Router} from 'express';
import {adminMiddleware, gameMiddleware, tokenMiddleware} from '../../middleware';
import {gameController} from '../../controller';
import {TokenActionEnum} from '../../constant';

const router = Router();

router.get('/', gameController.getAllGamesOrGameByName);

router.use(
    tokenMiddleware.checkTokenPresent,
    tokenMiddleware.verifyAndGetUserFromAuthToken(TokenActionEnum.AUTH_USER_ACCESS),
    adminMiddleware.isAdminChecker
);

router.post(
    '/',
    gameMiddleware.validateGame,
    gameController.addGame
);

router.use(gameMiddleware.isGameExists);

router.put('/', gameMiddleware.validateEditGame, gameController.editGame);

export const gameRouter = router;
