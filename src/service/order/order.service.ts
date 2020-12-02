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

  findAllOrdersByStatus(params: Partial<IOrder>, limit?: number, offset?: number): Promise<IOrder[]> {
    return OrderModel.find(params).populate('games.gameId').populate('userId').limit(limit as number).skip(offset as number).exec();
  }

  deleteOrderGameItem(_id: string): Promise<IOrder> {
    return OrderModel.updateOne({'games._id': _id}, {$pull: {games: {_id}}}).exec();
  }

  addOrderGameItem(_id: string, params: any): Promise<IOrder> {
    return OrderModel.updateOne({_id}, {$push: {games: params}}).exec();
  }

  getOrderByGameItemId(_id: string): Promise<IOrder | null> {
    return OrderModel.findOne({'games._id': _id}, 'total_sum status games.$').exec();
  }

  incrementRememberMailCount(_id: string): Promise<IOrder | null>{
    return OrderModel.updateOne({'games._id':_id},{$set:{'games.$.remember_mail_count':1}}).exec();
  }
}

export const orderService = new OrderService();
