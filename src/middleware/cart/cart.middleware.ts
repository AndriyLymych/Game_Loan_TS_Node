import {ICart, IRequest} from '../../interface';
import {NextFunction, Response} from 'express';
import {validate} from 'joi';
import {customErrors, ErrorHandler} from '../../errors';
import {ResponseStatusCodeEnum} from '../../constant';
import {cartValidator} from '../../validators/cart';

class CartMiddleware {
  validateCartData(req: IRequest, res: Response, next: NextFunction) {
    const cartData: Partial<ICart> = req.body;
    const {error} = validate(cartData, cartValidator);

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

export const cartMiddleware = new CartMiddleware();
