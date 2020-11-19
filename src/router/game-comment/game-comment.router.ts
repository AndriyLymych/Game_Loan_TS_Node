import {Router} from 'express';

import {gameCommentMiddleware, gameMiddleware, tokenMiddleware} from '../../middleware';
import {TokenActionEnum} from '../../constant/token';
import {gameCommentController} from '../../controller/game-comment';

const router = Router();

router.get('/', gameMiddleware.isGameExists, gameCommentController.getAllCommentsForGame);

router.use(
  tokenMiddleware.checkTokenPresent,
  tokenMiddleware.verifyAndGetUserFromAuthToken(TokenActionEnum.AUTH_USER_ACCESS)
);

router.post(
  '/',
  gameCommentMiddleware.validateNewComment,
  gameMiddleware.isGameExists,
  gameCommentController.addComment
);

router.put(
  '/:id',
  gameCommentMiddleware.validateNewComment,
  gameCommentController.editComment
);
router.delete(
  '/:id',
  gameCommentController.deleteComment
);

export const gameCommentRouter = router;
