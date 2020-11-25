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
router.put('/:itemId', cartMiddleware.validateCartData, cartController.editCartPositionLoanTime);
router.get('/', cartController.getAuthorizedCart);
router.post('/', cartController.addGameToCart);
router.delete('/item/:itemId', cartController.deleteCartPosition);
router.delete('/:cartId', cartController.clearCart);

export const cartRouter = router;
