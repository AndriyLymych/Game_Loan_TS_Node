export interface IReplyComment {
    comment?: string,
    userId?: string,
    createdAt?: string
    updatedAt?: string

}

export interface IGameComment {
    _id: string,
    comment: string,
    rate: number,
    userId: string,
    gameId: string,
    replyComments: [IReplyComment]
    createdAt: string
    updatedAt: string
}
