import {IGame, IGameComment, IRequest, IUser} from '../../interface';
import {NextFunction, Response} from 'express';
import {gameCommentService, historyService} from '../../service';
import {HistoryEvent, ResponseStatusCodeEnum} from '../../constant';
import {customErrors, ErrorHandler} from '../../errors';

class GameCommentController {
  async addComment(req: IRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const {comment, rate = 0} = req.body as IGameComment;
      const {_id: userId} = req.user as IUser;
      const {_id: gameId} = req.game as IGame;

      await gameCommentService.addGameComment({rate, comment, gameId, userId});
      await historyService.addEvent({event: HistoryEvent.addGameComment, userId});

      res.status(ResponseStatusCodeEnum.CREATED).end();

    } catch (e) {
      next(e);
    }
  }

  async getAllCommentsForGame(req: IRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const {_id: gameId} = req.game as IGame;
      const {limit} = req.query;
      let {page = 1} = req.query;

      if (+page === 0) {page = 1;}
      page = +page - 1;

      const comments = await gameCommentService.getAllCommentsByGameId(gameId, Number(limit), Number(limit) * page);

      if (!comments.length) {
        throw new ErrorHandler(
          ResponseStatusCodeEnum.BAD_REQUEST,
          customErrors.BAD_REQUEST_NO_COMMENTS.message,
          customErrors.BAD_REQUEST_NO_COMMENTS.code
        );
      }

      res.json(comments);

    } catch (e) {
      next(e);
    }
  }
}

export const gameCommentController = new GameCommentController();
