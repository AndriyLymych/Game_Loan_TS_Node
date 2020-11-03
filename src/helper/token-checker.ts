import {verify} from 'jsonwebtoken';
import {promisify} from 'util';
import {TokenActionEnum} from '../constant/token';
import {config} from '../config';
import {customErrors, ErrorHandler} from '../errors';
import {ResponseStatusCodeEnum} from '../constant/db';

const promisedVerification = promisify(verify);

export const tokenChecker = async (method: TokenActionEnum, token: string): Promise<void> => {
  try {
    switch (method) {
      case TokenActionEnum.REGISTER_USER:
        await promisedVerification(token, config.JWT_CONFIRM_REGISTER_SECRET);
        break;
      case TokenActionEnum.RESET_PASSWORD:
        await promisedVerification(token, config.JWT_PASS_RESET_SECRET);
        break;
      case TokenActionEnum.AUTH_USER_ACCESS:
        await promisedVerification(token, config.JWT_ACCESS_SECRET);
        break;
      case TokenActionEnum.AUTH_USER_REFRESH:
        await promisedVerification(token, config.JWT_REFRESH_SECRET);
        break;
      default:
        throw new ErrorHandler(
          ResponseStatusCodeEnum.FORBIDDEN,
          customErrors.FORBIDDEN_WRONG_TOKEN_ACTION.message,
          customErrors.FORBIDDEN_WRONG_TOKEN_ACTION.code
        );

    }
  } catch (e) {
    throw new ErrorHandler(
      ResponseStatusCodeEnum.UNAUTHORIZED,
      customErrors.UNAUTHORIZED_BAD_TOKEN.message,
      customErrors.UNAUTHORIZED_BAD_TOKEN.code
    );
  }
};
