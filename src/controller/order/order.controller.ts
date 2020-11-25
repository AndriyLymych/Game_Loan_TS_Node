import {NextFunction, Response} from 'express';
import {IRequest, IUser} from 'src/interface';
import {cartService} from '../../service/cart';
import {customErrors, ErrorHandler} from '../../errors';
import {ResponseStatusCodeEnum} from '../../constant/db';
import {gameService} from '../../service/game';
import {GameStatusEnum} from '../../constant/game';
import {orderService} from "../../service/order";
import {historyService} from "../../service/history";
import {HistoryEvent} from "../../constant/history";

class OrderController {
    async createAuthorizedOrderRequest(req: IRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const {cartId} = req.params;
            const {_id: userId} = req.user as IUser;
            const {total_sum} = req.body;

            const cartExists = await cartService.getCartById(cartId);

            if (!cartExists || userId.toString() !== cartExists.userId.toString()) {
                throw new ErrorHandler(
                    ResponseStatusCodeEnum.BAD_REQUEST,
                    customErrors.BAD_REQUEST_CART_IS_NOT_EXISTS.message,
                    customErrors.BAD_REQUEST_CART_IS_NOT_EXISTS.code
                );
            }

            await orderService.createOrderRequest({userId, games: cartExists.games, total_sum});

            for (const {gameId} of cartExists.games) {
                await gameService.editGameById(gameId as string, {status: GameStatusEnum.CONSIDER});
            }

            await historyService.addEvent({event: HistoryEvent.createOrder, userId});

            await cartService.deleteCart(cartExists._id);

            res.end();

        } catch (e) {
            next(e);
        }
    }

    async createUnauthorizedOrderRequest(req:IRequest,res:Response,next:NextFunction):Promise<void>{
        try {

        }catch (e) {
            next(e)
        }
    }
}

export const orderController = new OrderController();
