import {Router} from 'express';
import {adminMiddleware, cartMiddleware, orderMiddleware, tokenMiddleware} from '../../middleware';
import {TokenActionEnum} from '../../constant';
import {orderController} from '../../controller';

const router = Router();

router.post(
  '/unauthorized/:cartId',
  orderMiddleware.validateUnauthorizedOrderData,
  orderController.createUnauthorizedOrderRequest
);

router.use(tokenMiddleware.checkTokenPresent, tokenMiddleware.verifyAndGetUserFromAuthToken(TokenActionEnum.AUTH_USER_ACCESS));

router.get('/customer', orderController.getAllOrdersByStatusForCustomer);
router.post(
  '/authorized/:cartId',
  orderController.createAuthorizedOrderRequest
);

router.use(adminMiddleware.isAdminChecker);

router.get('/', orderController.getAllOrdersByStatus);
router.delete('/:itemId', orderController.deleteOrderItem);

router.use(orderMiddleware.isOrderExists);

router.post('/game', cartMiddleware.validateCartData, orderController.addGameItemToOrder);
router.put('/accept', orderController.acceptOrder);
router.put('/reject', orderController.rejectOrder);

export const orderRouter = router;
