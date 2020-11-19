import {Document, Model, model, Schema} from 'mongoose';
import {IGameComment} from '../../interface';
import {DbTableNameEnum} from '../../constant';

type GameCommentType = IGameComment & Document

const GameCommentSchema: Schema = new Schema<IGameComment>({
  comment: {
    type: String,
    required: true
  },
  rate: {
    type: Number,
    default: 0
  },
  gameId: {
    type: Schema.Types.ObjectId,
    ref: DbTableNameEnum.GAME,
    required: true
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: DbTableNameEnum.USER,
    required: true
  },
  replyComments: [{
    comment: {
      type: String
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: DbTableNameEnum.USER
    }
  }]
},
{
  timestamps: true
});

export const GameCommentModel: Model<GameCommentType> = model<GameCommentType>(
  DbTableNameEnum.GAME_COMMENT,
  GameCommentSchema
);
