import {IRequest, IUser} from '../../interface';
import {NextFunction, Response} from 'express';
import {cartService, gameService} from '../../service';
import {customErrors, ErrorHandler} from '../../errors';
import {ResponseStatusCodeEnum} from '../../constant/';

class CartController {
  async addGameToCart(req: IRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const {_id: userId} = req.user as IUser;
      const {gameId} = req.query;
      const {type} = req.body;

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

      await cartService.addProduct(userId, {gameId: gameId as string, type});

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

      // const acc = cartExists.games.reduce((pr: number, {loan_time,gameId,type}) => {
      //   return pr += loan_time as number * 2;
      //
      // }, 0);
      // console.log(acc);
      cartInfo.cart = cartExists;

      res.json(cartInfo);

    } catch (e) {
      next(e);
    }
  }
}

export const cartController = new CartController();
