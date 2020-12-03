import {TokenActionEnum} from '../constant/token';

export interface IActionToken {
    actionToken?: string,
    action?: TokenActionEnum
}

export interface IUser {
    _id: string;
    email: string;
    password: string;
    photo?: string;
    name: string;
    surname: string;
    age: number;
    phone?: string;
    role: string;
    gender?: string;
    status: string;
    blockPeriod?: number;
    tokens?: IActionToken[];
    createdAt: string;
}
