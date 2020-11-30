import {IOrder, IRequest} from '../../interface';
import {NextFunction, Response} from 'express';
import {validate} from 'joi';
import {unauthorizedOrderValidator} from '../../validators';
import {customErrors, ErrorHandler} from '../../errors';
import {ResponseStatusCodeEnum} from '../../constant/db';
import {orderService} from '../../service/order';

class OrderMiddleware {

  validateUnauthorizedOrderData(req: IRequest, res: Response, next: NextFunction) {
    const orderData: Partial<IOrder> = req.body;
    const {error} = validate(orderData, unauthorizedOrderValidator);

    if (error) {
      return next(new ErrorHandler(
        ResponseStatusCodeEnum.FORBIDDEN,
        error.details[0].message,
        customErrors.FORBIDDEN_VALIDATION_ERROR.code
      ));
    }
    next();
  }

  async isOrderExists(req: IRequest, res: Response, next: NextFunction) {
    try {
      const {orderId} = req.query;

      const orderExists = await orderService.getOrderById(orderId as string);

      if (!orderExists) {
        throw new ErrorHandler(
          ResponseStatusCodeEnum.BAD_REQUEST,
          customErrors.BAD_REQUEST_ORDER_IS_NOT_EXISTS.message,
          customErrors.BAD_REQUEST_ORDER_IS_NOT_EXISTS.code
        );
      }

      req.order = orderExists;

      next();
    } catch (e) {
      next(e);
    }
  }
}

export const orderMiddleware = new OrderMiddleware();
