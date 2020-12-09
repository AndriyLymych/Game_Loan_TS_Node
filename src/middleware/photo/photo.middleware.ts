import {IRequest} from '../../interface';
import {NextFunction, Response} from 'express';
import {PhotoParamsEnum, ResponseStatusCodeEnum} from '../../constant';
import {customErrors, ErrorHandler} from '../../errors';

class PhotoMiddleware {

  photoChecker(req: IRequest, res: Response, next: NextFunction): void {
    req.photos = [];

    if (!req.files) {
      return next(new ErrorHandler(
        ResponseStatusCodeEnum.FORBIDDEN,
        customErrors.BAD_REQUEST_PHOTO_IS_NOT_PRESENT.message,
        customErrors.BAD_REQUEST_PHOTO_IS_NOT_PRESENT.code
      ));
    }

    const files = Object.values(req.files);

    for (let i = 0; i < files.length; i++) {
      const {mimetype, size} = files[i];

      if (PhotoParamsEnum.PHOTO_MIMETYPES.includes(mimetype)) {

        if (PhotoParamsEnum.PHOTO_MAX_SIZE < size) {
          return next(new ErrorHandler(
            ResponseStatusCodeEnum.FORBIDDEN,
            customErrors.FORBIDDEN_BIG_PHOTO_SIZE.message,
            customErrors.FORBIDDEN_BIG_PHOTO_SIZE.code
          ));
        }

        req.photos.push(files[i]);

      }
    }

    next();
  }

  photoCountCheck(req: IRequest, res: Response, next: NextFunction): void {
    const photos = req.photos !;

    if (photos.length > 1) {
      throw new ErrorHandler(
        ResponseStatusCodeEnum.FORBIDDEN,
        customErrors.FORBIDDEN_WRONG_PHOTO_COUNT.message,
        customErrors.FORBIDDEN_WRONG_PHOTO_COUNT.code
      );
    }

    next();
  }

}

export const photoMiddleware = new PhotoMiddleware();
