import {NextFunction, Response} from 'express';
import {IRequest, IUser} from '../../interface';
import {hashPassword, tokenCreator} from '../../helper';
import {HistoryEvent, ResponseStatusCodeEnum, TokenActionEnum, UserRoleEnum, UserStatusEnum} from '../../constant';
import {customErrors, ErrorHandler} from '../../errors';
import {emailService, historyService, userService} from '../../service';

class UserController {
    createUser = (roleType: UserRoleEnum) => async (req: IRequest, res: Response, next: NextFunction) => {
      try {
        const user: IUser = req.body;
        const {email} = user;

        const userExist = await userService.getUserByParams({email});

        if (userExist) {
          throw new ErrorHandler(
            ResponseStatusCodeEnum.BAD_REQUEST,
            customErrors.BAD_REQUEST_USER_REGISTERED.message,
            customErrors.BAD_REQUEST_USER_REGISTERED.code
          );
        }
        if (roleType === UserRoleEnum.ADMIN) {
          user.role = UserRoleEnum.ADMIN;
        }
        user.password = await hashPassword(user.password);

        const {access_token} = tokenCreator(TokenActionEnum.REGISTER_USER);

        const {_id} = await userService.createUser(user);
        await userService.insertActionToken(_id, {
          action: TokenActionEnum.REGISTER_USER,
          actionToken: access_token
        });
        await historyService.addEvent({event: HistoryEvent.createUser, userId: _id});
        await emailService.sendEmail(email, TokenActionEnum.REGISTER_USER, {token: access_token});

        //TODO add user avatar save
        res.status(ResponseStatusCodeEnum.CREATED).end();

      } catch (e) {
        next(e);
      }
    }

    async confirmUserAccount(req: IRequest, res: Response, next: NextFunction): Promise<void> {
      try {
        const {_id} = req.user as IUser;

        await userService.confirmAccount(_id, UserStatusEnum.CONFIRMED);
        await historyService.addEvent({event: HistoryEvent.confirmAccount, userId: _id});

        res.end();

      } catch (e) {
        next(e);
      }
    }
}

export const userController = new UserController();
