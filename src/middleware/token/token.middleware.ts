import {IRequest, IUser} from '../../interface';
import {NextFunction, Response} from 'express';
import {RequestHeaderEnum, ResponseStatusCodeEnum, TokenActionEnum} from '../../constant';
import {customErrors, ErrorHandler} from '../../errors';
import {tokenChecker} from '../../helper/token-checker';
import {authService, userService} from '../../service';

class TokenMiddleware {
    checkTokenPresent = (req: IRequest, res: Response, next: NextFunction) => {
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
    };

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
    verifyAndGetUserFromAuthToken = (method: TokenActionEnum) => async (req: IRequest, res: Response, next: NextFunction) => {

        const token: any = req.get(RequestHeaderEnum.AUTHORIZATION);
        let userFromAuthToken;

        switch (method) {
            case TokenActionEnum.AUTH_USER_ACCESS:
                await tokenChecker(TokenActionEnum.AUTH_USER_ACCESS, token);
                userFromAuthToken = await authService.getUserFromAuthToken({accessToken: token}) as IUser;

                break;

            case TokenActionEnum.AUTH_USER_REFRESH:
                await tokenChecker(TokenActionEnum.AUTH_USER_REFRESH, token);
                userFromAuthToken = await authService.getUserFromAuthToken({refreshToken: token});

                break;
            default:
                throw new ErrorHandler(
                    ResponseStatusCodeEnum.UNAUTHORIZED,
                    customErrors.FORBIDDEN_WRONG_TOKEN_ACTION.message,
                    customErrors.FORBIDDEN_WRONG_TOKEN_ACTION.code
                );
        }


        if (!userFromAuthToken) {
            return next(
                new ErrorHandler(
                    ResponseStatusCodeEnum.BAD_REQUEST,
                    customErrors.BAD_REQUEST_USER_IS_NOT_PRESENT.message,
                    customErrors.BAD_REQUEST_USER_IS_NOT_PRESENT.code
                )
            );
        }

        req.user = userFromAuthToken;

        next();
    };
}

export const tokenMiddleware = new TokenMiddleware();
