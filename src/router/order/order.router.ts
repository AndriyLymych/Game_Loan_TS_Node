import {Router} from 'express';
import {tokenMiddleware} from '../../middleware';
import {TokenActionEnum} from '../../constant';
import {orderController} from '../../controller';

const router = Router();

router.use(tokenMiddleware.checkTokenPresent, tokenMiddleware.verifyAndGetUserFromAuthToken(TokenActionEnum.AUTH_USER_ACCESS));
router.post('/authorized/:cartId',orderController.createAuthorizedOrderRequest);

export const orderRouter = router;
