import {validate} from 'joi';

import {IGameComment, IRequest} from '../../interface';
import {NextFunction, Response} from 'express';
import {createGameCommentValidator} from '../../validators';
import {customErrors, ErrorHandler} from '../../errors';
import {ResponseStatusCodeEnum} from '../../constant';
import {gameCommentService} from '../../service/game-comment';

class GameCommentMiddleware {
  validateNewComment(req: IRequest, res: Response, next: NextFunction): void {
    const newComment = req.body as Partial<IGameComment>;

    const {error} = validate(newComment, createGameCommentValidator);

    if (error) {
      throw new ErrorHandler(
        ResponseStatusCodeEnum.FORBIDDEN,
        error.details[0].message,
        customErrors.FORBIDDEN_VALIDATION_ERROR.code
      );
    }

    next();
  }

  async commentExists(req: IRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const {id} = req.params;

      const comment = await gameCommentService.getCommentById(id as string);

      if (!comment) {
        throw new ErrorHandler(
          ResponseStatusCodeEnum.BAD_REQUEST,
          customErrors.BAD_REQUEST_COMMENT_IS_NOT_PRESENT.message,
          customErrors.BAD_REQUEST_COMMENT_IS_NOT_PRESENT.code
        );
      }

      req.comment = comment;

      next();

    } catch (e) {
      next(e);
    }
  }

}

export const gameCommentMiddleware = new GameCommentMiddleware();
