import {Router} from 'express';
import {orderMiddleware, tokenMiddleware} from '../../middleware';
import {TokenActionEnum} from '../../constant';
import {orderController} from '../../controller';

const router = Router();

router.post(
  '/unauthorized/:cartId',
  orderMiddleware.validateUnauthorizedOrderData,
  orderController.createUnauthorizedOrderRequest
);

router.use(tokenMiddleware.checkTokenPresent, tokenMiddleware.verifyAndGetUserFromAuthToken(TokenActionEnum.AUTH_USER_ACCESS));
router.post('/authorized/:cartId', orderMiddleware.validateAuthorizedOrderData, orderController.createAuthorizedOrderRequest);

export const orderRouter = router;
