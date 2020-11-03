import {IRequest} from '../../interface/request.interface';
import {NextFunction, Response} from 'express';
import {RequestHeaderEnum} from '../../constant/common';
import {customErrors, ErrorHandler} from '../../errors';
import {ResponseStatusCodeEnum} from '../../constant/db';
import {TokenActionEnum} from '../../constant/token';
import {tokenChecker} from '../../helper/token-checker';
import {userService} from '../../service/user';

class TokenMiddleware {
  checkTokenPresentMiddleware = (req: IRequest, res: Response, next: NextFunction)=> {
    const token = req.get(RequestHeaderEnum.AUTHORIZATION);
    if (!token) {
      return next(
        new ErrorHandler(
          ResponseStatusCodeEnum.UNAUTHORIZED,
          customErrors.UNAUTHORIZED_TOKEN_NOT_PRESENT.message,
          customErrors.UNAUTHORIZED_TOKEN_NOT_PRESENT.code
        )
      );
    }
    next();
  }

    verifyAndGetUserFromActionToken = (method: TokenActionEnum) => async (req: IRequest, res: Response, next: NextFunction) => {

      const token: any = req.get(RequestHeaderEnum.AUTHORIZATION);

      switch (method) {
        case TokenActionEnum.REGISTER_USER:
          await tokenChecker(TokenActionEnum.REGISTER_USER, token);
          break;

        case TokenActionEnum.RESET_PASSWORD:
          await tokenChecker(TokenActionEnum.RESET_PASSWORD, token);
          break;
        default:
          throw new ErrorHandler(
            ResponseStatusCodeEnum.UNAUTHORIZED,
            customErrors.FORBIDDEN_WRONG_TOKEN_ACTION.message,
            customErrors.FORBIDDEN_WRONG_TOKEN_ACTION.code
          );
      }

      const userFromActionToken = await userService.getUserFromActionToken(token);

      if (!userFromActionToken) {
        return next(
          new ErrorHandler(
            ResponseStatusCodeEnum.BAD_REQUEST,
            customErrors.BAD_REQUEST_USER_IS_NOT_PRESENT.message,
            customErrors.BAD_REQUEST_USER_IS_NOT_PRESENT.code
          )
        );
      }

      req.user = userFromActionToken;

      next();
    };
}

export const tokenMiddleware = new TokenMiddleware();
