export interface IGameCart {
    _id?: string,
    gameId?: string,
    loan_time?: number,
    remember_mail_count?: number
}

export interface ICart {
    _id: string;
    games: IGameCart[];
    tempId?: string,
    userId: string;
    updatedAt: string,
    createdAt: string;
}
