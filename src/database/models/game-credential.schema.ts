import {Document, Model, model, Schema} from 'mongoose';
import {IGameCredential} from '../../interface';
import {DbTableNameEnum} from '../../constant';

type GameCredentialType = IGameCredential & Document

const GameCredentialSchema: Schema = new Schema<IGameCredential>({
  login: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  gameId: {
    type: Schema.Types.ObjectId,
    ref: DbTableNameEnum.GAME,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now()
  }
});

export const GameCredentialModel: Model<GameCredentialType> = model<GameCredentialType>(
  DbTableNameEnum.GAME_CREDENTIAL,
  GameCredentialSchema
);
