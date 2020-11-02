import {validate} from 'joi';

import {NextFunction, Request, Response} from 'express';
import {IUser} from '../../interface';
import {createUserValidator} from '../../validators/user';
import {customErrors, ErrorHandler} from '../../errors';
import {ResponseStatusCodeEnum} from '../../constant/db';

class UserMiddleware {
  validateUser(req: Request, res: Response, next: NextFunction) {
    const user: Partial<IUser> = req.body;

    const {error} = validate(user, createUserValidator);

    if (error) {
      throw new ErrorHandler(
        ResponseStatusCodeEnum.FORBIDDEN,
        error.details[0].message,
        customErrors.FORBIDDEN_VALIDATION_ERROR.code
      );
    }

    next();
  }
}

export const userMiddleware = new UserMiddleware();
