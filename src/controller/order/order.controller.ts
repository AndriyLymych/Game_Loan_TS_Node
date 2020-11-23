import {IGame, IGameCart, IOrder, IRequest} from "../../interface";
import {NextFunction, Response} from "express";
import {gameService, orderService} from "../../service";

class OrderController {
    async submitUnauthorizedOrder(req: IRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const gamesId: [] = req.query;
            let games: Array<IGameCart> = [];
            const {email, phone, name} = req.body as Partial<IOrder>;

            for (const {gameId} of gamesId) {
                const {_id} = await gameService.getGameById(gameId as string);
                await orderService.submitOrder({email, phone, name,userId})
            }

        } catch (e) {
            next(e)
        }
    }
}

export const orderController = new OrderController();
