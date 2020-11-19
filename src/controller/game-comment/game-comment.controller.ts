import {NextFunction, Response} from 'express';

import {IGame, IGameComment, IRequest, IUser} from '../../interface';
import {gameCommentService, historyService} from '../../service';
import {HistoryEvent, ResponseStatusCodeEnum, UserRoleEnum} from '../../constant';
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

      if (+page === 0) {
        page = 1;
      }
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

  async editComment(req: IRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const {id} = req.params;
      const {_id} = req.user as IUser;
      const {comment} = req.body as Partial<IGameComment>;

      const commentExist = await gameCommentService.getCommentById(id);

      if (!commentExist || commentExist.userId.toString() !== _id.toString()) {
        //TODO

        throw new ErrorHandler(
          ResponseStatusCodeEnum.BAD_REQUEST,
          customErrors.BAD_REQUEST_COMMENT_IS_NOT_PRESENT.message,
          customErrors.BAD_REQUEST_COMMENT_IS_NOT_PRESENT.code
        );
      }

      await gameCommentService.updateCommentRecord(commentExist._id, _id, {comment});
      await historyService.addEvent(
        {
          event: `${HistoryEvent.editGameComment} with id ${commentExist._id}`,
          userId: _id
        }
      );

      res.end();

    } catch (e) {
      next(e);
    }
  }

  async deleteComment(req: IRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const {id} = req.params;
      const {_id, role} = req.user as IUser;
      console.log(role !== UserRoleEnum.ADMIN);
      const isCommentExists = await gameCommentService.getCommentById(id);

      if (!isCommentExists) {
        throw new ErrorHandler(
          ResponseStatusCodeEnum.BAD_REQUEST,
          customErrors.BAD_REQUEST_COMMENT_IS_NOT_PRESENT.message,
          customErrors.BAD_REQUEST_COMMENT_IS_NOT_PRESENT.code
        );
      }

      if (role !== UserRoleEnum.ADMIN && isCommentExists.userId.toString() !== _id.toString()) {
        // todo
        throw new ErrorHandler(
          ResponseStatusCodeEnum.FORBIDDEN,
          customErrors.FORBIDDEN_YOU_CANT_DELETE_COMMENT.message,
          customErrors.FORBIDDEN_YOU_CANT_DELETE_COMMENT.code
        );
      }

      await gameCommentService.deleteCommentRecord(isCommentExists._id);

      res.end();

    } catch (e) {
      next(e);
    }
  }

}

export const gameCommentController = new GameCommentController();
