import {Document, Model, model, Schema} from 'mongoose';
import {ICart} from '../../interface';
import {DbTableNameEnum} from '../../constant';

type CartType = ICart & Document

const CartSchema: Schema = new Schema<ICart>({
  games: [{
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
  }],
  tempId: {
    type: String,
    required: false
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: DbTableNameEnum.USER,
    required: false
  }
}, {
  timestamps: true
});

export const CartModel: Model<CartType> = model<CartType>(DbTableNameEnum.CART, CartSchema);
