import {IOrder} from '../../interface';
import {OrderModel} from '../../database/models';

class OrderService {
  createOrderRequest(params: Partial<IOrder>): Promise<IOrder | null> {
    return new OrderModel(params).save();
  }
}

export const orderService = new OrderService();
