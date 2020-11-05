import {IGame} from '../../interface';
import {GameModel} from '../../database/models';

class GameService {
  addGame(game: Partial<IGame>): Promise<IGame> {
    return new GameModel(game).save();
  }
}

export const gameService = new GameService();
