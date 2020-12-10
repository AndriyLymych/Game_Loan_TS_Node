import {IGame} from '../../interface';
import {GameModel} from '../../database/models';
import {GameVersionEnum} from '../../constant/game';

class GameService {
  addGame(game: Partial<IGame>): Promise<IGame> {
    return new GameModel(game).save();
  }

  editGameById(_id: string, params: Partial<IGame>): Promise<IGame | null> {
    return GameModel.findByIdAndUpdate(_id, params).exec();
  }

  deleteGameById(_id: string): Promise<IGame | null> {
    return GameModel.findByIdAndDelete(_id).exec();
  }

  getGameById(_id: string): Promise<IGame | null> {
    return GameModel.findById(_id).exec();

  }

  getGames(limit: number, offset: number): Promise<IGame[]> {
    return GameModel.find({version: GameVersionEnum.P3})
      .limit(limit)
      .skip(offset)
      .exec();
  }

  getGamesByName(name: string, limit: number, offset: number): Promise<IGame[]> {
    return GameModel.find({
      title: {$regex: `${name}`, $options: 'i'},
      version: GameVersionEnum.P3
    })
      .limit(limit)
      .skip(offset)
      .exec();
  }

  addGameCollectionPhoto(_id: string, photo: any): Promise<IGame | null> {
    return GameModel.updateOne({_id}, {$push: {pictures: photo}}).exec();
  }
  deleteGameCollectionPhoto(_id: string): Promise<IGame> {
    return GameModel.updateOne({'pictures._id': _id}, {$pull: {pictures: {_id}}}).exec();
  }
  getGameCollectionPhoto(_id: string): Promise<IGame | null> {
    return GameModel.findOne({'pictures._id': _id}, 'pictures.$').exec();
  }

//   getAllGamesByName(name: string, limit: number, offset: number): Promise<IGame[]> {
//     return GameModel.find({
//       title: {$regex: `${name}`, $options: 'i'}
//     },'title version')
//       .limit(limit)
//       .skip(offset)
//       .exec();
//   }
}

export const gameService = new GameService();
