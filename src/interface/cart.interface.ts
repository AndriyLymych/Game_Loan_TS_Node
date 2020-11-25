export interface IGameCart {
    _id?: string,
    gameId?: string,
    loan_time?: number
}

export interface ICart {
    _id: string;
    games: IGameCart[];
    userId: string;
    updatedAt: string,
    createdAt: string;
}
