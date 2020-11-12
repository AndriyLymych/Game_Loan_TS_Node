import {Router} from 'express';
import {userController} from '../../controller';
import {adminMiddleware, tokenMiddleware, userMiddleware} from '../../middleware';
import {TokenActionEnum, UserRoleEnum} from '../../constant';

const router = Router();

router.post('/', userMiddleware.validateUser, userController.createUser(UserRoleEnum.USER));
router.put(
  '/confirm',
  tokenMiddleware.checkTokenPresent,
  tokenMiddleware.verifyAndGetUserFromActionToken(TokenActionEnum.REGISTER_USER),
  userController.confirmUserAccount
);

router.use(
  tokenMiddleware.checkTokenPresent,
  tokenMiddleware.verifyAndGetUserFromAuthToken(TokenActionEnum.AUTH_USER_ACCESS)
);
router.put(
  '/password',
  userMiddleware.validateChangePassword,
  userController.changePassword
);
router.put(
  '/',
  userMiddleware.validateUpdateUserData,
  userController.updateUserProfile
);
router.get('/', adminMiddleware.isAdminChecker, userController.findUsersOrUserByName);

export const userRouter = router;
