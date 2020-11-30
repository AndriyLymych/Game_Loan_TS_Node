import {Document, Model, model, Schema} from 'mongoose';
import {IOrder} from '../../interface';
import {DbTableNameEnum, OrderStatusEnum} from '../../constant';

type OrderType = IOrder & Document

const OrderSchema: Schema = new Schema<IOrder>({
  email: {
    type: String,
    required: false
  },
  phone: {
    type: String,
    required: false
  },
  name: {
    type: String,
    required: false
  },
  games: [
    {
      gameId: {
        type: Schema.Types.ObjectId,
        ref: DbTableNameEnum.GAME,
        required: false
      },
      loan_time: {
        type: Number,
        required: false,
        default: 1
      }
    }
  ],
  total_sum: {
    type: Number,
    required: false
  },
  status: {
    type: String,
    required: true,
    default: OrderStatusEnum.PENDING
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: DbTableNameEnum.USER,
    required: false
  }
}, {
  timestamps: true
});

export const OrderModel: Model<OrderType> = model<OrderType>(DbTableNameEnum.ORDER, OrderSchema);
