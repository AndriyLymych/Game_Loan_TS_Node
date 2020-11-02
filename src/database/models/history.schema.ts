import {Document, Model, model, Schema} from 'mongoose';
import {IHistory} from '../../interface';
import {DbTableNameEnum} from '../../constant';

export type HistoryType = IHistory & Document

export const HistorySchema: Schema = new Schema<IHistory>({
  event: {
    type: String,
    required: true
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: DbTableNameEnum.USER
  },
  createdAt: {
    type: Date,
    default: Date.now()
  }
});

export const HistoryModel: Model<HistoryType> = model<HistoryType>(DbTableNameEnum.HISTORY, HistorySchema);
