import {Router} from 'express';
import {adminMiddleware, gameCredentialMiddleware, tokenMiddleware} from '../../middleware';
import {TokenActionEnum} from '../../constant';
import {gameCredentialController} from '../../controller';

const router = Router();

router.use(
  tokenMiddleware.checkTokenPresent,
  tokenMiddleware.verifyAndGetUserFromAuthToken(TokenActionEnum.AUTH_USER_ACCESS),
  adminMiddleware.isAdminChecker
);

router.post(
  '/',
  gameCredentialMiddleware.validateCreateAndUpdateCredentials,
  gameCredentialController.addCredential
);

router.use(gameCredentialMiddleware.isCredentialsExist);

router.put(
  '/',
  gameCredentialMiddleware.validateCreateAndUpdateCredentials,
  gameCredentialController.editCredential
);

router.delete('/',gameCredentialController.deleteCredential);

export const gameCredentialRouter = router;
