import {IGameCart, IRequest, IUser} from '../../interface';
import {NextFunction, Response} from 'express';
import {cartService, gameService} from '../../service';
import {customErrors, ErrorHandler} from '../../errors';
import {GameStatusEnum, ResponseStatusCodeEnum} from '../../constant/';
import {calculateCartHelper} from '../../helper';

class CartController {

  async addGameToAuthorizedCart(req: IRequest, res: Response, next: NextFunction): Promise<void> {
    try {

      const {_id: userId} = req.user as IUser;
      const {gameId} = req.query;

      const isGameAvailable = await gameService.getGameById(gameId as string);

      if (isGameAvailable?.status !== GameStatusEnum.AVAILABLE) {
        throw new ErrorHandler(
          ResponseStatusCodeEnum.BAD_REQUEST,
          customErrors.BAD_REQUEST_GAME_IS_NOT_AVAILABLE_NOW.message,
          customErrors.BAD_REQUEST_GAME_IS_NOT_AVAILABLE_NOW.code
        );
      }
      const cartExist = await cartService.getCartByParams({userId});

      if (!cartExist) {
        await cartService.createCart({userId});
      }

      const gameInCartAlreadyExist = await cartService.gameFromCart(gameId as string, cartExist?._id as string);

      if (gameInCartAlreadyExist) {
        throw new ErrorHandler(
          ResponseStatusCodeEnum.BAD_REQUEST,
          customErrors.BAD_REQUEST_GAME_ALREADY_PRESENT_IN_CART.message,
          customErrors.BAD_REQUEST_GAME_ALREADY_PRESENT_IN_CART.code
        );
      }

      await cartService.addProduct({userId}, {gameId: gameId as string});

      res.status(ResponseStatusCodeEnum.CREATED).end();

    } catch (e) {
      next(e);
    }
  }

  async addGameToUnauthorizedCart(req: IRequest, res: Response, next: NextFunction): Promise<void> {
    try {

      const {gameId, tempId} = req.query;

      const isGameAvailable = await gameService.getGameById(gameId as string);

      if (isGameAvailable?.status !== GameStatusEnum.AVAILABLE) {
        throw new ErrorHandler(
          ResponseStatusCodeEnum.BAD_REQUEST,
          customErrors.BAD_REQUEST_GAME_IS_NOT_AVAILABLE_NOW.message,
          customErrors.BAD_REQUEST_GAME_IS_NOT_AVAILABLE_NOW.code
        );
      }

      const cartExist = await cartService.getCartByParams({tempId: tempId as string});

      if (!cartExist) {
        await cartService.createCart({tempId: tempId as string});
      }

      const gameInCartAlreadyExist = await cartService.gameFromCart(gameId as string, cartExist?._id as string);

      if (gameInCartAlreadyExist) {
        throw new ErrorHandler(
          ResponseStatusCodeEnum.BAD_REQUEST,
          customErrors.BAD_REQUEST_GAME_ALREADY_PRESENT_IN_CART.message,
          customErrors.BAD_REQUEST_GAME_ALREADY_PRESENT_IN_CART.code
        );
      }

      await cartService.addProduct({tempId: tempId as string}, {gameId: gameId as string});

      res.status(ResponseStatusCodeEnum.CREATED).end();

    } catch (e) {
      next(e);
    }
  }

  async getUnauthorizedCart(req: IRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const cartInfo: any = {};

      const {tempId} = req.query as any;

      const cartExist = await cartService.getCartByParams({tempId: tempId as string});

      if (!cartExist) {
        throw new ErrorHandler(
          ResponseStatusCodeEnum.BAD_REQUEST,
          customErrors.BAD_REQUEST_CART_IS_NOT_EXISTS.message,
          customErrors.BAD_REQUEST_CART_IS_NOT_EXISTS.code
        );
      }

      const totalSum = calculateCartHelper(cartExist);

      cartInfo.cart = cartExist;
      cartInfo.totalSum = totalSum;

      res.json(cartInfo);

    } catch (e) {
      next(e);
    }
  }

  async getAuthorizedCart(req: IRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const cartInfo: any = {};
      const {_id: userId} = req.user as IUser;

      const cartExists = await cartService.getCartByParams({userId});

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

  async editAuthorizedCartPositionLoanTime(req: IRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const {itemId} = req.params;
      const {_id} = req.user as IUser;
      const {loan_time} = req.body as IGameCart;

      const cartItem = await cartService.getAuthorizedCartItem(itemId, _id);

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

  async editUnauthorizedCartPositionLoanTime(req: IRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const {itemId} = req.params;
      const {tempId} = req.query;
      const {loan_time} = req.body as IGameCart;

      const cartItem = await cartService.getUnauthorizedCartItem(itemId, tempId as string);

      if (!cartItem || tempId?.toString() !== cartItem.tempId?.toString()) {
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

  async deleteUnauthorizedCartPosition(req: IRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const {itemId} = req.params;
      const {tempId} = req.query;

      const cartItem = await cartService.getUnauthorizedCartItem(itemId, tempId as string);

      if (!cartItem || tempId?.toString() !== cartItem.tempId?.toString()) {
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

  async deleteAuthorizedCartPosition(req: IRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const {itemId} = req.params;
      const {_id} = req.user as IUser;

      const cartItem = await cartService.getAuthorizedCartItem(itemId, _id);

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

  async clearAuthorizedCart(req: IRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const {cartId} = req.params;
      const {_id} = req.user as IUser;

      const cart = await cartService.getCartById(cartId);

      if (!cart || _id.toString() !== cart.userId.toString()) {
        throw new ErrorHandler(
          ResponseStatusCodeEnum.BAD_REQUEST,
          customErrors.BAD_REQUEST_CART_IS_NOT_EXISTS.message,
          customErrors.BAD_REQUEST_CART_IS_NOT_EXISTS.code
        );
      }

      await cartService.deleteCart(cartId);

      res.end();

    } catch (e) {
      next(e);
    }
  }

  async clearUnauthorizedCart(req: IRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const {cartId} = req.params;
      const {tempId} = req.query ;

      const cart = await cartService.getCartById(cartId);

      if (!cart || tempId?.toString() !== cart.tempId?.toString()) {
        throw new ErrorHandler(
          ResponseStatusCodeEnum.BAD_REQUEST,
          customErrors.BAD_REQUEST_CART_IS_NOT_EXISTS.message,
          customErrors.BAD_REQUEST_CART_IS_NOT_EXISTS.code
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
