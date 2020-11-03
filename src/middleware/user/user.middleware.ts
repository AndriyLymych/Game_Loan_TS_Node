import {validate} from 'joi';

import {NextFunction, Request, Response} from 'express';
import {IRequest, IUser} from '../../interface';
import {createUserValidator} from '../../validators';
import {customErrors, ErrorHandler} from '../../errors';
import {ResponseStatusCodeEnum, UserStatusEnum} from '../../constant';
import {userService} from '../../service';

class UserMiddleware {
  validateUser(req: Request, res: Response, next: NextFunction) {
    const user: Partial<IUser> = req.body;

    const {error} = validate(user, createUserValidator);

    if (error) {
      return next(new ErrorHandler(
        ResponseStatusCodeEnum.FORBIDDEN,
        error.details[0].message,
        customErrors.FORBIDDEN_VALIDATION_ERROR.code
      ));
    }

    next();
  }

  async isUserExist(req: IRequest, res: Response, next: NextFunction): Promise<void> {
    const {email}: Partial<IUser> = req.body;

    const userExist = await userService.getUserByParams({email});

    if (!userExist) {
      return next(new ErrorHandler(
        ResponseStatusCodeEnum.BAD_REQUEST,
        customErrors.BAD_REQUEST_USER_IS_NOT_PRESENT.message,
        customErrors.BAD_REQUEST_USER_IS_NOT_PRESENT.code
      ));
    }

    req.user = userExist;

    next();
  }

  isUserHasAccess(req: IRequest, res: Response, next: NextFunction) {
    const {status} = req.user as IUser;

    if (status === UserStatusEnum.PENDING) {
      return next(new ErrorHandler(
        ResponseStatusCodeEnum.BAD_REQUEST,
        customErrors.BAD_REQUEST_USER_IS_NOT_CONFIRMED.message,
        customErrors.BAD_REQUEST_USER_IS_NOT_CONFIRMED.code
      ));
    }
    if (status === UserStatusEnum.BLOCKED) {
      return next(new ErrorHandler(
        ResponseStatusCodeEnum.BAD_REQUEST,
        customErrors.BAD_REQUEST_USER_IS_BLOCKED.message,
        customErrors.BAD_REQUEST_USER_IS_BLOCKED.code
      ));
    }
    next();
  }

}

export const userMiddleware = new UserMiddleware();
