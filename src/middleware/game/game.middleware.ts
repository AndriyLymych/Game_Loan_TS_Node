import {IGame, IRequest} from '../../interface';
import {NextFunction, Response} from 'express';
import {validate} from 'joi';
import {createGameValidator, editGameValidator} from '../../validators';
import {customErrors, ErrorHandler} from '../../errors';
import {ResponseStatusCodeEnum} from '../../constant';
import {gameService} from '../../service/game';

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
  validateEditGame(req: IRequest, res: Response, next: NextFunction) {

    const game: Partial<IGame> = req.body;
    const {error} = validate(game, editGameValidator);

    if (error) {
      return next(new ErrorHandler(
        ResponseStatusCodeEnum.FORBIDDEN,
        error.details[0].message,
        customErrors.FORBIDDEN_VALIDATION_ERROR.code
      ));
    }
    next();
  }

  async isGameExists(req: IRequest, res: Response, next: NextFunction): Promise<void> {

    try {
      const {id} = req.query;

      const isGameExists = await gameService.getGameById(id as string);

      if (!isGameExists) {
        throw new ErrorHandler(
          ResponseStatusCodeEnum.BAD_REQUEST,
          customErrors.BAD_REQUEST_GAME_IS_NOT_FOUND.message,
          customErrors.BAD_REQUEST_GAME_IS_NOT_FOUND.code
        );
      }

      req.game = isGameExists;
      next();
    } catch (e) {
      next(e);
    }
  }

}

export const gameMiddleware = new GameMiddleware();
