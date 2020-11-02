import {NextFunction, Request, Response} from 'express';
import {IUser} from '../../interface';
import {userService} from '../../service/user';
import {hashPassword, tokenCreator} from '../../helper';
import {TokenActionEnum} from '../../constant/token';
import {historyService} from '../../service/history';
import {HistoryEvent} from '../../constant/history';
import {customErrors, ErrorHandler} from '../../errors';
import {ResponseStatusCodeEnum} from '../../constant/db';
import {emailService} from '../../service/email/email.service';

class UserController {
  async createUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const user = req.body as IUser;
      const {email} = user;

      const userExist = await userService.getUserByParams({email});

      if (userExist) {
        throw new ErrorHandler(
          ResponseStatusCodeEnum.BAD_REQUEST,
          customErrors.BAD_REQUEST_USER_REGISTERED.message,
          customErrors.BAD_REQUEST_USER_REGISTERED.code
        );
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
}

export const userController = new UserController();
