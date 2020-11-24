import {Router} from 'express';
import {cartMiddleware, tokenMiddleware} from '../../middleware';
import {TokenActionEnum} from '../../constant';
import {cartController} from '../../controller';

const router = Router();

router.get('/unauthorized', cartController.getUnauthorizedCart);

router.use(
  tokenMiddleware.checkTokenPresent,
  tokenMiddleware.verifyAndGetUserFromAuthToken(TokenActionEnum.AUTH_USER_ACCESS)
);
router.get('/', cartController.getAuthorizedCart);
router.post('/', cartMiddleware.validateCartData, cartController.addGameToCart);

export const cartRouter = router;