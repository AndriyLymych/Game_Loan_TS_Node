import * as jwt from 'jsonwebtoken';
import {ResponseStatusCodeEnum,TokenActionEnum} from '../constant';
import {config} from '../config';
import {customErrors, ErrorHandler} from '../errors';

export const tokenCreator = (method: Partial<TokenActionEnum>): { access_token: string, refresh_token?: string } => {

  let access_token = '';
  let refresh_token = '';

  switch (method) {
    case TokenActionEnum.REGISTER_USER :
      access_token = jwt.sign(
        {},
        config.JWT_CONFIRM_REGISTER_SECRET,
        {expiresIn: config.JWT_CONFIRM_REGISTER_LIFETIME}
      );
      break;
    case TokenActionEnum.RESET_PASSWORD :
      access_token = jwt.sign(
        {},
        config.JWT_PASS_RESET_SECRET,
        {expiresIn: config.JWT_PASS_RESET_LIFETIME}
      );
      break;
    case TokenActionEnum.AUTH_USER_ACCESS :
      access_token = jwt.sign(
        {},
        config.JWT_ACCESS_SECRET,
        {expiresIn: config.ACCESS_TOKEN_LIFETIME}
      );
      refresh_token = jwt.sign(
        {},
        config.JWT_REFRESH_SECRET,
        {expiresIn: config.REFRESH_TOKEN_LIFETIME}
      );
      break;

    default:
      throw new ErrorHandler(
        ResponseStatusCodeEnum.FORBIDDEN,
        customErrors.FORBIDDEN_WRONG_TOKEN_ACTION.message,
        customErrors.FORBIDDEN_WRONG_TOKEN_ACTION.code
      );
  }

  return {
    access_token,
    refresh_token
  };
};
