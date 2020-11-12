import {IGame} from '../../interface';
import {GameModel} from '../../database/models';

class GameService {
  addGame(game: Partial<IGame>): Promise<IGame> {
    return new GameModel(game).save();
  }

  editGameById(_id: string, params: Partial<IGame>): Promise<IGame | null> {
    return GameModel.findByIdAndUpdate(_id, params).exec();
  }

  getGameById(_id: string, params: Partial<IGame>): Promise<IGame | null> {
    return GameModel.findByIdAndUpdate(_id, params).exec();
  }

  getGames(limit: number, offset: number): Promise<IGame[]> {
    return GameModel.find()
      .limit(limit)
      .skip(offset)
      .exec();
  }

  getGamesByName(name: string, limit: number, offset: number): Promise<IGame[]> {
    return GameModel.find({
      title: {$regex: `${name}`, $options: 'i'}
    })
      .limit(limit)
      .skip(offset)
      .exec();
  }
}

export const gameService = new GameService();