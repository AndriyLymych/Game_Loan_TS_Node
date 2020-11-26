import {Router} from 'express';
import {cartMiddleware, tokenMiddleware} from '../../middleware';
import {TokenActionEnum} from '../../constant';
import {cartController} from '../../controller';

const router = Router();

router.get('/unauthorized', cartController.getUnauthorizedCart);
router.post('/unauthorized', cartController.addGameToUnauthorizedCart);
router.put('/unauthorized/:itemId', cartMiddleware.validateCartData, cartController.editUnauthorizedCartPositionLoanTime);
router.delete('/unauthorized/item/:itemId', cartController.deleteUnauthorizedCartPosition);
router.delete('/unauthorized/:cartId', cartController.clearUnauthorizedCart);

router.use(
  tokenMiddleware.checkTokenPresent,
  tokenMiddleware.verifyAndGetUserFromAuthToken(TokenActionEnum.AUTH_USER_ACCESS)
);
router.put('/:itemId', cartMiddleware.validateCartData, cartController.editAuthorizedCartPositionLoanTime);
router.get('/', cartController.getAuthorizedCart);
router.post('/', cartController.addGameToAuthorizedCart);
router.delete('/item/:itemId', cartController.deleteAuthorizedCartPosition);
router.delete('/:cartId', cartController.clearAuthorizedCart);

export const cartRouter = router;
