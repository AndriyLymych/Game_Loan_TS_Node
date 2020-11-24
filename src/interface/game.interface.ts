import {GameGenreEnum, GameStatusEnum, GameVersionEnum} from '../constant/game';

export interface IGame {
    _id: string;
    title: string;
    photo?: string[];
    description: string;
    version: GameVersionEnum,
    status: GameStatusEnum,
    price: number
    genre: GameGenreEnum[];
    rate?: number;
    size: number;
    createdAt: string;
}
