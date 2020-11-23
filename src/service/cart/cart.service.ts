import {ICart, IGameCart} from '../../interface';
import {CartModel} from '../../database/models';

class CartService {
  createCart(cartObj: Partial<ICart>): Promise<ICart> {
    return new CartModel(cartObj).save();
  }

  getCartByParams(userId: string): Promise<ICart | null> {
    return CartModel.findOne({userId}).exec();
  }

  addProduct(userId: string, params: IGameCart): Promise<ICart | null> {
    return CartModel.update({userId}, {$push: {games: params}}).exec();
  }

  gameFromCart(gameId: string): Promise<ICart | null> {
    return CartModel.findOne({'games.gameId': gameId}, 'games.$').exec();
  }
}

export const cartService = new CartService();
