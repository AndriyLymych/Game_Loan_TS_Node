import {GameGenreEnum, GameStatusEnum, GameVersionEnum} from '../constant';

interface IGamePhoto {
    mainPhoto?: string,
    photoCollection?: string[]
}

export interface IGame {
    _id: string;
    title: string;
    photo?: IGamePhoto;
    description: string;
    version: GameVersionEnum,
    status: GameStatusEnum,
    price: number
    genre: GameGenreEnum[];
    rate?: number;
    size: number;
    createdAt: string;
}
