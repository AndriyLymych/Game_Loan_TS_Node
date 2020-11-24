import {IGameCart} from './cart.interface';

export interface IOrder {
    _id: string;
    email?: string,
    phone?: string,
    name?: string,
    games: IGameCart[];
    userId?: string;
    updatedAt: string,
    createdAt: string;
}
