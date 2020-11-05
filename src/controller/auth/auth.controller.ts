import {NextFunction, Response} from 'express';
import {IRequest, IUser} from '../../interface';
import {comparePassword, hashPassword, tokenCreator} from '../../helper';
import {customErrors, ErrorHandler} from '../../errors';
import {HistoryEvent, RequestHeaderEnum, ResponseStatusCodeEnum, TokenActionEnum} from '../../constant';
import {authService, emailService, historyService, userService} from '../../service';

class AuthController {
  async authUser(req: IRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const {password} = req.body as Partial<IUser>;
      const {password: passwordFromDb, _id} = req.user as IUser;

      const isPasswordCorrect = await comparePassword(password as string, passwordFromDb);

      if (!isPasswordCorrect) {
        throw new ErrorHandler(
          ResponseStatusCodeEnum.BAD_REQUEST,
          customErrors.BAD_REQUEST_USER_IS_NOT_PRESENT.message,
          customErrors.BAD_REQUEST_USER_IS_NOT_PRESENT.code
        );
      }

      const {access_token, refresh_token} = tokenCreator(TokenActionEnum.AUTH_USER_ACCESS);

      const {accessToken, refreshToken} = await authService.insertAuthTokens({
        accessToken: access_token,
        refreshToken: refresh_token,
        userId: _id
      });

      await historyService.addEvent({event: HistoryEvent.authUser, userId: _id});

      res.status(ResponseStatusCodeEnum.CREATED).json({accessToken, refreshToken});

    } catch (e) {
      next(e);
    }
  }

  async logoutUser(req: IRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const accessToken = req.get(RequestHeaderEnum.AUTHORIZATION) as string;
      const {_id} = req.user as IUser;

      await authService.dropAuthTokenPair({accessToken});
      await historyService.addEvent({event: HistoryEvent.logoutUser, userId: _id});

      res.end();

    } catch (e) {
      next(e);
    }
  }

  async refreshToken(req: IRequest, res: Response, next: NextFunction) {
    try {
      const {_id: userId} = req.user as Partial<IUser>;
      const token = req.get(RequestHeaderEnum.AUTHORIZATION);

      const {access_token, refresh_token} = tokenCreator(TokenActionEnum.AUTH_USER_ACCESS);
      await authService.dropAuthTokenPair({refreshToken: token});
      const {accessToken, refreshToken} = await authService.insertAuthTokens(
        {
          accessToken: access_token,
          refreshToken: refresh_token,
          userId
        });
      await historyService.addEvent({event: HistoryEvent.refreshToken, userId});

      res.status(ResponseStatusCodeEnum.CREATED).json({
        accessToken,
        refreshToken
      });

    } catch (e) {
      next(e);
    }
  }

  async sendForgotPasswordMail(req: IRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const user = req.user as IUser;

      const {access_token} = tokenCreator(TokenActionEnum.RESET_PASSWORD);

      await userService.insertActionToken(user._id, {
        actionToken: access_token,
        action: TokenActionEnum.RESET_PASSWORD
      });
      await emailService.sendEmail(user.email, TokenActionEnum.RESET_PASSWORD, {token: access_token});
      await historyService.addEvent({event: HistoryEvent.sendResetPasswordMail, userId: user._id});

      res.end();

    } catch (e) {
      next(e);
    }
  }

  async resetPassword(req: IRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const {password, passwordAgain} = req.body;
      const {_id: userId} = req.user as IUser;

      if (password !== passwordAgain) {
        throw new ErrorHandler(
          ResponseStatusCodeEnum.FORBIDDEN,
          customErrors.FORBIDDEN_PASSWORDS_NOT_EQUAL.message,
          customErrors.FORBIDDEN_PASSWORDS_NOT_EQUAL.code
        );
      }

      const newPassword: string = await hashPassword(password);

      await userService.updateUser(userId, {password: newPassword, tokens: []});
      await historyService.addEvent({event: HistoryEvent.resetPassword, userId});

      res.end();

    } catch (e) {
      next(e);
    }
  }
}

export const authController = new AuthController();
