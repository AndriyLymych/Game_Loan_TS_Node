import {IRequest, IUser} from '../../interface';
import {NextFunction, Response} from 'express';
import {cartService} from '../../service';
import {customErrors, ErrorHandler} from '../../errors';
import {ResponseStatusCodeEnum} from '../../constant/db';

class CartController {
    async addGameToCart(req: IRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const {_id: userId} = req.user as IUser;
            const {gameId} = req.query;
            const {version} = req.body;

            const cartExist = await cartService.getCartByParams(userId);

            if (!cartExist) {
                await cartService.createCart({userId});
            }

            const gameInCartAlreadyExist = await cartService.gameFromCart(gameId as string);

            if (gameInCartAlreadyExist) {
                throw new ErrorHandler(
                    ResponseStatusCodeEnum.BAD_REQUEST,
                    customErrors.BAD_REQUEST_GAME_ALREADY_PRESENT_IN_CART.message,
                    customErrors.BAD_REQUEST_GAME_ALREADY_PRESENT_IN_CART.code
                );
            }

            await cartService.addProduct(userId, {gameId: gameId as string, version});

            res.status(ResponseStatusCodeEnum.CREATED).end();

        } catch (e) {
            next(e);
        }
    }
}

export const cartController = new CartController();
