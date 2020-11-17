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
    replyComment: {
      type: String
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: DbTableNameEnum.USER
    },
    commentId: {
      type: Schema.Types.ObjectId
    },
    createdAt: {
      type: Date,
      default: Date.now()
    },
    updatedAt: {
      type: Date,
      default: Date.now()
    }
  }],
  createdAt: {
    type: Date,
    default: Date.now()
  },
  updatedAt: {
    type: Date,
    default: Date.now()
  }
});

export const GameCommentModel: Model<GameCommentType> = model<GameCommentType>(
  DbTableNameEnum.GAME_COMMENT,
  GameCommentSchema
);
