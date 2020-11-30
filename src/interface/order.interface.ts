import {IGameCart} from './cart.interface';

export interface IOrder {
    _id: string;
    email?: string,
    phone?: string,
    name?: string,
    games: IGameCart[];
    total_sum?: number
    status: string,
    userId?: string;
    updatedAt: string,
    createdAt: string;
}
