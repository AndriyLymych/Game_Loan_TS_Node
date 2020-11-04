import {IRequest, IUser} from '../../interface';
import {NextFunction, Response} from 'express';
import {ResponseStatusCodeEnum, UserRoleEnum} from '../../constant';
import {customErrors, ErrorHandler} from '../../errors';

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
}

export const adminMiddleware = new AdminMiddleware();
