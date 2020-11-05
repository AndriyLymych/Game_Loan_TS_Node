import {GameGenreEnum, GameStatusEnum, GameVersionEnum} from '../constant/game';

export interface IGameType {
    type?: GameVersionEnum,
    status?: GameStatusEnum,
    price?: number
}

export interface IGame {
    _id: string;
    title: string;
    photo?: string[];
    description: string;
    version: IGameType[];
    genre: GameGenreEnum[];
    rate?: number[];
    size: number;
    createdAt: string;
}
