import {ICart, IGameCart} from '../../interface';
import {CartModel} from '../../database/models';

class CartService {
  createCart(cartObj: Partial<ICart>): Promise<ICart> {
    return new CartModel(cartObj).save();
  }

  getCartByParams(params: Partial<ICart>): Promise<ICart | null> {
    return CartModel.findOne(params).populate({
      path: 'games.gameId',
      select: 'title version price -_id'
    }).exec();
  }

  getCartById(_id: string): Promise<ICart | null> {
    return CartModel.findById(_id).exec();
  }

  addProduct(condition: Partial<ICart>, params: any): Promise<ICart | null> {
    return CartModel.update(condition, {$push: {games: params}}).exec();
  }

  deleteCartPosition(_id: string): Promise<IGameCart> {
    return CartModel.updateOne(
      {'games._id': _id},
      {$pull: {games: {_id}}}
    ).exec();
  }

  gameFromCart(gameId: string, _id: string): Promise<ICart | null> {
    return CartModel.findOne({'games.gameId': gameId, _id}, 'games.$').exec();
  }

  getAuthorizedCartItem(_id: string, userId: string): Promise<ICart | null> {
    return CartModel.findOne({'games._id': _id, userId}, 'userId games.$').exec();
  }
  getUnauthorizedCartItem(_id: string, tempId: string): Promise<ICart | null> {
    return CartModel.findOne({'games._id': _id, tempId}, 'tempId games.$').exec();
  }

  editCartItemLoanTime(_id: string, loan_time: number): Promise<ICart | null> {
    return CartModel.updateOne({'games._id': _id}, {$set: {'games.$.loan_time': loan_time}}).exec();
  }

  deleteCart(_id: string): Promise<ICart | null> {
    return CartModel.findByIdAndDelete(_id).exec();
  }
}

export const cartService = new CartService();
