import {IOrder, IRequest} from '../../interface';
import {NextFunction, Response} from 'express';
import {validate} from 'joi';
import {totalSumValidator, unauthorizedOrderValidator} from '../../validators';
import {customErrors, ErrorHandler} from '../../errors';
import {ResponseStatusCodeEnum} from '../../constant/db';

class OrderMiddleware {
  validateAuthorizedOrderData(req: IRequest, res: Response, next: NextFunction) {
    const orderData: Partial<IOrder> = req.body;
    const {error} = validate(orderData, totalSumValidator);

    if (error) {
      return next(new ErrorHandler(
        ResponseStatusCodeEnum.FORBIDDEN,
        error.details[0].message,
        customErrors.FORBIDDEN_VALIDATION_ERROR.code
      ));
    }
    next();
  }

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
}

export const orderMiddleware = new OrderMiddleware();
