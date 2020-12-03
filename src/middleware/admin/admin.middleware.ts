import {IRequest, IUser} from '../../interface';
import {NextFunction, Request, Response} from 'express';
import {ResponseStatusCodeEnum, UserRoleEnum} from '../../constant';
import {customErrors, ErrorHandler} from '../../errors';
import {validate} from 'joi';
import {blockPeriodValidator} from '../../validators';

class AdminMiddleware {
  isAdminChecker(req: IRequest, res: Response, next: NextFunction) {
    const {role} = req.user as IUser;

    if (role !== UserRoleEnum.ADMIN) {
      next(new ErrorHandler(
        ResponseStatusCodeEnum.FORBIDDEN,
        customErrors.FORBIDDEN_YOU_ARE_NOT_ADMIN.message,
        customErrors.FORBIDDEN_YOU_ARE_NOT_ADMIN.code
      ));
    }

    next();
  }

  validateBlockPeriod(req: Request, res: Response, next: NextFunction) {

    const blockPeriod: Partial<IUser> = req.body;

    const {error} = validate(blockPeriod, blockPeriodValidator);

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

export const adminMiddleware = new AdminMiddleware();
