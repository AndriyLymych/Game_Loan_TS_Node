import {IGame, IRequest} from '../../interface';
import {NextFunction, Response} from 'express';
import {validate} from 'joi';
import {createGameValidator} from '../../validators';
import {customErrors, ErrorHandler} from '../../errors';
import {ResponseStatusCodeEnum} from '../../constant';

class GameMiddleware {
  validateGame(req: IRequest, res: Response, next: NextFunction) {

    const game: Partial<IGame> = req.body;
    const {error} = validate(game, createGameValidator);

    if (error) {
      return next(new ErrorHandler(
        ResponseStatusCodeEnum.FORBIDDEN,
        error.details[0].message,
        customErrors.FORBIDDEN_VALIDATION_ERROR.code
      ));
    }
    next();
  }

}

export const gameMiddleware = new GameMiddleware();
