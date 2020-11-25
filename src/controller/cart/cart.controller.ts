import {IGameCart, IRequest, IUser} from '../../interface';
import {NextFunction, Response} from 'express';
import {cartService, gameService} from '../../service';
import {customErrors, ErrorHandler} from '../../errors';
import {ResponseStatusCodeEnum} from '../../constant/';
import {calculateCartHelper} from '../../helper';

class CartController {
  async addGameToCart(req: IRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const {_id: userId} = req.user as IUser;
      const {gameId} = req.query;

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

      await cartService.addProduct(userId, {gameId: gameId as string});

      res.status(ResponseStatusCodeEnum.CREATED).end();

    } catch (e) {
      next(e);
    }
  }

  async getUnauthorizedCart(req: IRequest, res: Response, next: NextFunction): Promise<void> {
    try {

      const games: any[] = [];
      let {gamesId} = req.query as any;

      gamesId = gamesId.split(',');

      await Promise.all(gamesId.map(async (id: string) => {
        const game = await gameService.getGameById(id) as any;

        games.push(game);

      }));

      res.json(games);

    } catch (e) {
      next(e);
    }
  }

  async getAuthorizedCart(req: IRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const cartInfo: any = {};
      const {_id: userId} = req.user as IUser;

      const cartExists = await cartService.getCartByParams(userId);

      if (!cartExists) {
        throw new ErrorHandler(
          ResponseStatusCodeEnum.BAD_REQUEST,
          customErrors.BAD_REQUEST_CART_IS_NOT_EXISTS.message,
          customErrors.BAD_REQUEST_CART_IS_NOT_EXISTS.code
        );
      }

      const totalSum = calculateCartHelper(cartExists);

      cartInfo.cart = cartExists;
      cartInfo.totalSum = totalSum;

      res.json(cartInfo);

    } catch (e) {
      next(e);
    }
  }

  async editCartPositionLoanTime(req: IRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const {itemId} = req.params;
      const {_id} = req.user as IUser;
      const {loan_time} = req.body as IGameCart;

      const cartItem = await cartService.getCartItem(itemId);

      if (!cartItem || _id.toString() !== cartItem.userId.toString()) {
        throw new ErrorHandler(
          ResponseStatusCodeEnum.BAD_REQUEST,
          customErrors.BAD_REQUEST_GAME_IS_NOT_PRESENT_IN_CART.message,
          customErrors.BAD_REQUEST_GAME_IS_NOT_PRESENT_IN_CART.code
        );
      }

      await cartService.editCartItemLoanTime(itemId, loan_time as number);

      res.end();

    } catch (e) {
      next(e);
    }
  }

  async deleteCartPosition(req: IRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const {itemId} = req.params;
      const {_id} = req.user as IUser;

      const cartItem = await cartService.getCartItem(itemId);

      if (!cartItem || _id.toString() !== cartItem.userId.toString()) {
        throw new ErrorHandler(
          ResponseStatusCodeEnum.BAD_REQUEST,
          customErrors.BAD_REQUEST_GAME_IS_NOT_PRESENT_IN_CART.message,
          customErrors.BAD_REQUEST_GAME_IS_NOT_PRESENT_IN_CART.code
        );
      }

      await cartService.deleteCartPosition(itemId);

      res.end();

    } catch (e) {
      next(e);
    }
  }

  async clearCart(req: IRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const {cartId} = req.params;
      const {_id} = req.user as IUser;

      const cart = await cartService.getCartById(cartId);

      if (!cart || _id.toString() !== cart.userId.toString()) {
        throw new ErrorHandler(
          ResponseStatusCodeEnum.BAD_REQUEST,
          customErrors.BAD_REQUEST_GAME_IS_NOT_PRESENT_IN_CART.message,
          customErrors.BAD_REQUEST_GAME_IS_NOT_PRESENT_IN_CART.code
        );
      }

      await cartService.deleteCart(cartId);

      res.end();

    } catch (e) {
      next(e);
    }
  }

}

export const cartController = new CartController();
