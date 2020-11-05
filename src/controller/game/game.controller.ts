import {IGame, IRequest, IUser} from '../../interface';
import {NextFunction, Response} from 'express';
import {gameService, historyService} from '../../service';
import {HistoryEvent} from '../../constant/history';
import {ResponseStatusCodeEnum} from '../../constant';

class GameController {
  async addGame(req: IRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const game = req.body as IGame;
      const {_id:userId} = req.user as IUser;

      await gameService.addGame(game);
      await historyService.addEvent({event:HistoryEvent.addGame,userId});

      res.status(ResponseStatusCodeEnum.CREATED).end();

    } catch (e) {
      next(e);
    }
  }

}

export const gameController = new GameController();
