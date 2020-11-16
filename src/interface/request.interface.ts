import {Request} from 'express';

import {IUser} from './user.interface';
import {IGameCredential} from './game-credential.interface';

export interface IRequest extends Request {
    user?: IUser,
    credentials?: IGameCredential
}
