import {GameVersionEnum} from '../constant/game';

export interface IGameCart {
    gameId?: string,
    loan_time?: number,
    type?: GameVersionEnum
}

export interface ICart {
    _id: string;
    games: IGameCart[];
    userId: string;
    updatedAt: string,
    createdAt: string;
}