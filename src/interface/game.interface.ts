import {GameGenreEnum, GameStatusEnum, GameVersionEnum} from '../constant';

export interface IGamePictures {
    _id: string,
    picture: string
}

export interface IGame {
    _id: string;
    title: string;
    mainPhoto?: string;
    pictures: IGamePictures[],
    description: string;
    version: GameVersionEnum,
    status: GameStatusEnum,
    price: number
    genre: GameGenreEnum[];
    rate?: number;
    size: number;
    createdAt: string;
}
