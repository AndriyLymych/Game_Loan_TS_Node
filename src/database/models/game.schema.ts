import {Document, Model, model, Schema} from 'mongoose';
import {IGame} from '../../interface';
import {DbTableNameEnum, GameStatusEnum} from '../../constant';

type GameType = IGame & Document

const photoSubModel = {
  mainPhoto: {
    type: String,
    required: false
  },
  photoCollection: [{
    type: String,
    required: false
  }]
};
const GameSchema: Schema = new Schema<IGame>({
  title: {
    type: String,
    required: true
  },
  photo: photoSubModel,
  description: {
    type: String,
    required: true
  },
  version: {
    type: String,
    required: true
  },
  status: {
    type: String,
    required: false,
    default: GameStatusEnum.AVAILABLE
  },
  price: {
    type: String,
    required: true

  },
  genre: [{
    type: String,
    required: true
  }],
  rate: {
    type: Number,
    required: false,
    default: 0
  },
  size: {
    type: Number,
    required: false
  }
}, {
  timestamps: true
});

export const GameModel: Model<GameType> = model<GameType>(DbTableNameEnum.GAME, GameSchema);
