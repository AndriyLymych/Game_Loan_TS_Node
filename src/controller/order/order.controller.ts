import {NextFunction, Response} from 'express';
import {IRequest, IUser} from 'src/interface';
import {cartService} from '../../service/cart';
import {customErrors, ErrorHandler} from '../../errors';
import {ResponseStatusCodeEnum} from '../../constant/db';
import {gameService} from '../../service/game';
import {GameStatusEnum} from '../../constant/game';
import {orderService} from '../../service/order';
import {historyService} from '../../service/history';
import {HistoryEvent} from '../../constant/history';
import {gameCredentialService} from '../../service/game-credential';
import {OrderStatusEnum} from '../../constant/order';
import {emailService} from '../../service/email';
import {EmailActions} from '../../constant/common';

class OrderController {
    async createAuthorizedOrderRequest(req: IRequest, res: Response, next: NextFunction): Promise<void> {
        try {

            const gamesAlreadyInLoan: any[] = [];

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

            for (const {gameId} of cartExists.games) {

                const game = await gameService.getGameById(gameId as string);
                if (game?.status !== GameStatusEnum.AVAILABLE) {
                    gamesAlreadyInLoan.push(game);

                }
            }

            if (gamesAlreadyInLoan.length) {
                res.json(gamesAlreadyInLoan);
            }

            if (!gamesAlreadyInLoan.length) {
                await orderService.createOrderRequest({userId, games: cartExists.games, total_sum});

                for (const {gameId} of cartExists.games) {
                    await gameService.editGameById(gameId as string, {status: GameStatusEnum.CONSIDER});
                }

                await historyService.addEvent({event: HistoryEvent.createOrder, userId});

                await cartService.deleteCart(cartExists._id);

                res.end();
            }

        } catch (e) {
            next(e);
        }
    }

    async createUnauthorizedOrderRequest(req: IRequest, res: Response, next: NextFunction): Promise<void> {
        try {

            const gamesAlreadyInLoan: any[] = [];

            const {cartId} = req.params;
            const {tempId} = req.query;
            const {total_sum, email, phone, name} = req.body;

            const cartExists = await cartService.getCartById(cartId);

            if (!cartExists || tempId?.toString() !== cartExists.tempId?.toString()) {
                throw new ErrorHandler(
                    ResponseStatusCodeEnum.BAD_REQUEST,
                    customErrors.BAD_REQUEST_CART_IS_NOT_EXISTS.message,
                    customErrors.BAD_REQUEST_CART_IS_NOT_EXISTS.code
                );
            }

            for (const {gameId} of cartExists.games) {

                const game = await gameService.getGameById(gameId as string);
                if (game?.status !== GameStatusEnum.AVAILABLE) {
                    gamesAlreadyInLoan.push(game);

                }
            }

            if (gamesAlreadyInLoan.length) {
                res.json(gamesAlreadyInLoan);
            }

            if (!gamesAlreadyInLoan.length) {
                await orderService.createOrderRequest({phone, email, name, games: cartExists.games, total_sum});

                for (const {gameId} of cartExists.games) {
                    await gameService.editGameById(gameId as string, {status: GameStatusEnum.CONSIDER});
                }

                await cartService.deleteCart(cartExists._id);

                res.end();
            }

        } catch (e) {
            next(e);
        }
    }

    async acceptOrder(req: IRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const credentialData: any[] = [];
            const order = req.order as any;
            const {_id: userId} = req.user as IUser;

            if (order.status === OrderStatusEnum.ADMITTED) {
                throw new ErrorHandler(
                    ResponseStatusCodeEnum.BAD_REQUEST,
                    customErrors.BAD_REQUEST_ORDER_IS_ALREADY_ADMITTED.message,
                    customErrors.BAD_REQUEST_ORDER_IS_ALREADY_ADMITTED.code
                );
            }

            for (const {gameId} of order.games) {

                const credentials = await gameCredentialService.getCredentialByParams({gameId: gameId?._id as string});

                credentialData.push({
                    game: gameId.title,
                    version: gameId.version,
                    credentials: {
                        login: credentials?.login,
                        password: credentials?.password
                    }
                });

                await gameService.editGameById(gameId?.id as string, {status: GameStatusEnum.IN_LOAN});
            }

            await orderService.editOrderById(order._id, {status: OrderStatusEnum.ADMITTED});
            await historyService.addEvent({event: `${HistoryEvent.acceptOrder} with id ${order._id}`, userId});
            await emailService.sendEmail(
                order.email || order.userId.email,
                EmailActions.SEND_CREDENTIALS,
                {credentials: credentialData}
            );

            res.end();

        } catch (e) {
            next(e);
        }
    }

    async rejectOrder(req: IRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const {_id: orderId, status, games} = req.order as any;
            const {_id: userId} = req.user as IUser;

            if (status === OrderStatusEnum.REJECTED) {
                throw new ErrorHandler(
                    ResponseStatusCodeEnum.BAD_REQUEST,
                    customErrors.BAD_REQUEST_ORDER_IS_ALREADY_REJECTED.message,
                    customErrors.BAD_REQUEST_ORDER_IS_ALREADY_REJECTED.code
                );
            }

            await orderService.editOrderById(orderId, {status: OrderStatusEnum.REJECTED});

            for (const game of games) {
                await gameService.editGameById(game.gameId._id, {status: GameStatusEnum.AVAILABLE});
            }

            await historyService.addEvent({event: `${HistoryEvent.rejectOrder} with id ${orderId}`, userId});

            res.end();

        } catch (e) {
            next(e);
        }
    }

}

export const orderController = new OrderController();
