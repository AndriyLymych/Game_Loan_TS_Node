import {IRequest, IUser} from '../../interface';
import {NextFunction, Response} from 'express';
import {adminService, authService, emailService, historyService, userService} from '../../service';
import {customErrors, ErrorHandler} from '../../errors';
import {EmailActions, HistoryEvent, ResponseStatusCodeEnum, UserStatusEnum} from '../../constant';

class AdminController {
  async blockUser(req: IRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const {id} = req.params;
      const {_id: userId} = req.user as IUser;
      const {period} = req.body;

      const user = await userService.getUserById(id as Partial<IUser>);

      if (!user) {
        throw new ErrorHandler(
          ResponseStatusCodeEnum.BAD_REQUEST,
          customErrors.BAD_REQUEST_USER_IS_NOT_PRESENT.message,
          customErrors.BAD_REQUEST_USER_IS_NOT_PRESENT.code
        );
      }

      if (userId.toString() === id) {
        throw new ErrorHandler(
          ResponseStatusCodeEnum.BAD_REQUEST,
          customErrors.FORBIDDEN_YOU_CANT_BLOCK_YOURSELF.message,
          customErrors.FORBIDDEN_YOU_CANT_BLOCK_YOURSELF.code
        );
      }

      if (user.status === UserStatusEnum.BLOCKED) {
        throw new ErrorHandler(
          ResponseStatusCodeEnum.BAD_REQUEST,
          customErrors.BAD_REQUEST_USER_IS_ALREADY_BLOCKED.message,
          customErrors.BAD_REQUEST_USER_IS_ALREADY_BLOCKED.code
        );
      }

      await authService.dropAuthTokenPairByUserId(id);
      await adminService.blockOrUnlockUser(id, {
        status: UserStatusEnum.BLOCKED,
        blockPeriod: {period, updatedAt: Date.now().toString()}
      });
      await emailService.sendEmail(user.email, EmailActions.BLOCK_USER, {
        blockInfo: {
          name: user.name,
          surname: user.surname,
          period
        }
      });
      await historyService.addEvent({event: `${HistoryEvent.blockUser} with id ${id}`, userId});

      res.end();

    } catch (e) {
      next(e);
    }
  }

  async unlockUser(req: IRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const {id} = req.params;
      const {_id: userId} = req.user as IUser;

      const user = await userService.getUserById(id as Partial<IUser>);

      if (!user) {
        throw new ErrorHandler(
          ResponseStatusCodeEnum.BAD_REQUEST,
          customErrors.BAD_REQUEST_USER_IS_NOT_PRESENT.message,
          customErrors.BAD_REQUEST_USER_IS_NOT_PRESENT.code
        );
      }

      if (user.status === UserStatusEnum.CONFIRMED) {
        throw new ErrorHandler(
          ResponseStatusCodeEnum.BAD_REQUEST,
          customErrors.BAD_REQUEST_USER_IS_ALREADY_ACTIVE.message,
          customErrors.BAD_REQUEST_USER_IS_ALREADY_ACTIVE.code
        );
      }

      await adminService.blockOrUnlockUser(id, {
        status: UserStatusEnum.CONFIRMED,
        blockPeriod: {period: 0, updatedAt: Date.now().toString()}
      });
      await emailService.sendEmail(user.email, EmailActions.UNLOCK_USER, {
        unlockInfo: {
          name: user.name,
          surname: user.surname
        }
      });
      await historyService.addEvent({event: `${HistoryEvent.unlockUser} with id ${id}`, userId});

      res.end();

    } catch (e) {
      next(e);
    }
  }
}

export const adminController = new AdminController();
