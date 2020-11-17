interface IReplyComment {
    _id: string,
    replyComment: string,
    userId: string,
    commentId: string
    createdAt: string
    updatedAt: string

}

export interface IGameComment {
    _id: string,
    comment: string,
    rate: number,
    userId: string,
    gameId: string,
    repliedComments: Array<IReplyComment>
    createdAt: string
    updatedAt: string
}
