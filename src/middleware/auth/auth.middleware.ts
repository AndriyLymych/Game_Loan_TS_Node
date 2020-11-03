import {validate} from 'joi';

import {IRequest, IUser} from '../../interface';
import {NextFunction, Response} from 'express';
import {loginUserValidator} from '../../validators';
import {customErrors, ErrorHandler} from '../../errors';
import {ResponseStatusCodeEnum} from '../../constant';

class AuthMiddleware {
  validateLoginInfo(req: IRequest, res: Response, next: NextFunction) {
    const authData: Partial<IUser> = req.body;
    const {error} = validate(authData, loginUserValidator);

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

export const authMiddleware = new AuthMiddleware();
