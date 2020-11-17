import {validate} from 'joi';

import {IGameComment, IRequest} from '../../interface';
import {NextFunction, Response} from 'express';
import {createGameCommentValidator} from '../../validators';
import {customErrors, ErrorHandler} from '../../errors';
import {ResponseStatusCodeEnum} from '../../constant';

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

  // async commentExists (req: IRequest, res: Response, next: NextFunction): Promise<void> {
  //    try {
  //      const {gameId} = req.query;
  //
  //      await gameCommentService.
  //
  //    }catch (e) {
  //      next(e)
  //    }
  // }
  //TODO
}

export const gameCommentMiddleware = new GameCommentMiddleware();
