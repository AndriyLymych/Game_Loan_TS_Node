import {NextFunction, Response} from 'express';
import {validate} from 'joi';

import {gameCredentialValidator} from '../../validators';
import { IRequest} from '../../interface';
import {customErrors, ErrorHandler} from '../../errors';
import {ResponseStatusCodeEnum} from '../../constant';
import {gameCredentialService} from '../../service/game-credential';

class GameCredentialMiddleware {
  validateCreateAndUpdateCredentials(req: IRequest, res: Response, next: NextFunction) {
    const validateObj = req.body;
    const {error} = validate(validateObj, gameCredentialValidator);

    if (error) {
      throw new ErrorHandler(
        ResponseStatusCodeEnum.FORBIDDEN,
        error.details[0].message,
        customErrors.FORBIDDEN_VALIDATION_ERROR.code
      );
    }
    next();
  }

  async isCredentialsExist(req: IRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const {id} = req.query;

      const credentialsExists = await gameCredentialService.getCredentialByParams({_id: id as string});

      if (!credentialsExists) {

        throw new ErrorHandler(
          ResponseStatusCodeEnum.BAD_REQUEST,
          customErrors.BAD_REQUEST_CREDENTIALS_IS_NOT_FOUND.message,
          customErrors.BAD_REQUEST_CREDENTIALS_IS_NOT_FOUND.code
        );
      }

      req.credentials = credentialsExists;

      next();
    } catch (e) {
      next(e);
    }
  }
}

export const gameCredentialMiddleware = new GameCredentialMiddleware();
