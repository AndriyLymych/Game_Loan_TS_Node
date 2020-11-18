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
            {$match:{gameId}},
            {$group: {_id: gameId, avgMark: {$avg: '$rate'}}}
        ]).exec();

    }
}

export const gameCommentService = new GameCommentService();
