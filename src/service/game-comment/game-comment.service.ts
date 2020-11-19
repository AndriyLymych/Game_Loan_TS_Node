import {IGameComment} from '../../interface';
import {GameCommentModel} from '../../database';

class GameCommentService {
  addGameComment(commentObj: Partial<IGameComment>): Promise<IGameComment> {
    return new GameCommentModel(commentObj).save();
  }

  getAllCommentsByGameId(gameId: string, limit: number, offset: number): Promise<IGameComment[]> {
    return GameCommentModel.find({gameId}).limit(limit).skip(offset).exec();
  }

  getAvgGameMark(gameId: string): Promise<any> {
    return GameCommentModel.aggregate([
      {$match: {gameId}},
      {$group: {_id: gameId, avgMark: {$avg: '$rate'}}}
    ]).exec();

  }

  getCommentById(_id: string): Promise<IGameComment | null> {
    return GameCommentModel.findById(_id).exec();
  }

  updateCommentRecord(commentId: string, userId: string, params: Partial<IGameComment>): Promise<IGameComment | null> {
    return GameCommentModel.findOneAndUpdate({_id: commentId, userId}, params).exec();
  }

  deleteCommentRecord(commentId: string): Promise<IGameComment | null> {
    return GameCommentModel.findByIdAndDelete(commentId).exec();
  }

  addReplyComment(_id: string, params: any): Promise<IGameComment | null> {
    console.log('22.log');

    return GameCommentModel.update({_id}, {$push: {replyComments: params}}).exec();
  }
}

export const gameCommentService = new GameCommentService();
