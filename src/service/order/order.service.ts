import {IOrder} from '../../interface';
import {OrderModel} from '../../database/models';

class OrderService {
  createOrderRequest(params: Partial<IOrder>): Promise<IOrder | null> {
    return new OrderModel(params).save();
  }

  getOrderById(_id: string): Promise<IOrder | null> {
    return OrderModel.findById(_id).populate({
      path: 'games.gameId',
      select: 'title version '
    }).populate({
      path: 'userId',
      select: 'email name surname phone'
    }).exec();
  }

  editOrderById(_id: string, params: Partial<IOrder>): Promise<IOrder | null> {
    return OrderModel.findByIdAndUpdate(_id, params).exec();
  }
}

export const orderService = new OrderService();
