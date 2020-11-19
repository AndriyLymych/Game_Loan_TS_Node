import {IGame, IRequest, IUser} from '../../interface';
import {NextFunction, Response} from 'express';
import {gameCommentService, gameService, historyService} from '../../service';
import {HistoryEvent} from '../../constant/history';
import {ResponseStatusCodeEnum} from '../../constant';
import {customErrors, ErrorHandler} from '../../errors';

class GameController {
  async addGame(req: IRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const game = req.body as IGame;
      const {_id: userId} = req.user as IUser;

      await gameService.addGame(game);
      await historyService.addEvent({event: HistoryEvent.addGame, userId});

      res.status(ResponseStatusCodeEnum.CREATED).end();

    } catch (e) {
      next(e);
    }
  }

  async editGame(req: IRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const {title, description, genre, size, version} = req.body as IGame;
      const {_id: gameId} = req.game as IGame;
      const {_id: userId} = req.user as IUser;

      await gameService.editGameById(gameId, {title, description, genre, size, version});
      await historyService.addEvent({event: `${HistoryEvent.editGame} with id ${gameId}`, userId});

      res.end();

    } catch (e) {
      next(e);
    }
  }

  async deleteGame(req: IRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const {_id: gameId} = req.game as IGame;
      const {_id: userId} = req.user as IUser;

      await gameService.deleteGameById(gameId);
      await historyService.addEvent({event: `${HistoryEvent.deleteGame} with id ${gameId}`, userId});

      res.end();

    } catch (e) {
      next(e);
    }
  }

  async getAllGamesOrGameByName(req: IRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const {name, limit} = req.query;
      let {page = 1} = req.query;
      let games: IGame[] = [];

      if (+page === 0) {
        page = 1;
      }
      page = +page - 1;

      if (!name) {
        games = await gameService.getGames(Number(limit), Number(limit) * +page);
      }
      if (name) {
        games = await gameService.getGamesByName(name as string, Number(limit), Number(limit) * +page);

      }

      if (!games.length) {
        throw new ErrorHandler(
          ResponseStatusCodeEnum.BAD_REQUEST,
          customErrors.BAD_REQUEST_GAME_IS_NOT_FOUND.message,
          customErrors.BAD_REQUEST_GAME_IS_NOT_FOUND.code
        );
      }

      res.json(games);

    } catch (e) {
      next(e);
    }
  }

  async getAvgMark(req: IRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const {_id: gameId} = req.game as IGame;

      const [{avgMark}] = await gameCommentService.getAvgGameMark(gameId);
      await gameService.editGameById(gameId, {rate: avgMark});

      res.json(avgMark);

    } catch (e) {
      next(e);
    }
  }

}

export const gameController = new GameController();
