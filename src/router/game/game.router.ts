import {Router} from 'express';
import {adminMiddleware, gameMiddleware, photoMiddleware, tokenMiddleware} from '../../middleware';
import {gameController} from '../../controller';
import {TokenActionEnum} from '../../constant';

const router = Router();

router.get('/', gameController.getAllGamesOrGameByName);
router.get('/rate', gameMiddleware.isGameExists, gameController.getAvgMark);

router.use(
    tokenMiddleware.checkTokenPresent,
    tokenMiddleware.verifyAndGetUserFromAuthToken(TokenActionEnum.AUTH_USER_ACCESS),
    adminMiddleware.isAdminChecker
);
router.delete('/picture/item/:id', gameController.deleteGamePictureItem);
router.post(
    '/',
    photoMiddleware.photoChecker,
    photoMiddleware.photoCountCheck,
    gameMiddleware.validateGame,
    gameController.addGame
);

router.use(gameMiddleware.isGameExists);

router.put('/', gameMiddleware.validateEditGame, gameController.editGame);
router.delete('/', gameController.deleteGame);

router.use(photoMiddleware.photoChecker, photoMiddleware.photoCountCheck);
router.put(
    '/avatar',
    gameController.updateGameMainAvatar
);
router.post(
    '/picture/item',
    gameController.addGamePictureItem
);

export const gameRouter = router;
