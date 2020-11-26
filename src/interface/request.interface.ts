import {Request} from 'express';

import {IUser} from './user.interface';
import {IGameCredential} from './game-credential.interface';
import {IGame} from './game.interface';
import {IGameComment} from './game-comment.interface';
import {IOrder} from './order.interface';

export interface IRequest extends Request {
    user?: IUser,
    credentials?: IGameCredential,
    game?: IGame,
    comment?: IGameComment,
    order?: IOrder
}
