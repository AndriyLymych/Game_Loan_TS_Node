import {IOrder} from "../../interface";
import {OrderModel} from "src/database/models";

class OrderService {
    submitOrder(params: Partial<IOrder>): Promise<IOrder | null> {
        return new OrderModel(params).save()
    }
}

export const orderService = new OrderService();
