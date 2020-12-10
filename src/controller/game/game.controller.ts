import {IGame, IRequest, IUser} from '../../interface';
import {NextFunction, Response} from 'express';
import {gameCommentService, gameService, historyService} from '../../service';
import {HistoryEvent} from '../../constant/history';
import {ResponseStatusCodeEnum} from '../../constant';
import {customErrors, ErrorHandler} from '../../errors';
import * as uuid from 'uuid';
import * as fs from 'fs-extra';
import {resolve} from 'path';

class GameController {
    async addGame(req: IRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const game = req.body as IGame;

            const {_id: userId} = req.user as IUser;
            const [photo] = req.photos as any;

            const randomName = uuid.v4();
            const globalAny = global as any;
            const appRoot = globalAny.appRoot;

            const {_id} = await gameService.addGame(game);

            await historyService.addEvent({event: HistoryEvent.addGame, userId});

            const photoDir = `game/${_id}/avatar`;
            const photoExtension = photo.name.split('.').pop();
            const photoName = `${randomName}.${photoExtension}`;

            fs.mkdirSync(resolve(appRoot, 'public', photoDir), {recursive: true});
            await photo.mv(resolve(appRoot, 'public', photoDir, photoName));

            await gameService.editGameById(_id, {
                mainPhoto: `${photoDir}/${photoName}`
            });

            res.status(ResponseStatusCodeEnum.CREATED).end();

        } catch (e) {
            next(e);
        }
    }

    async updateGameMainAvatar(req: IRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const [photo] = req.photos as any;

            const {_id} = req.game as IGame;
            const randomName = uuid.v4();
            const globalAny = global as any;
            const appRoot = globalAny.appRoot;

            const photoDir = `game/${_id}/avatar`;
            const photoExtension = photo.name.split('.').pop();
            const photoName = `${randomName}.${photoExtension}`;

            fs.mkdirSync(resolve(appRoot, 'public', photoDir), {recursive: true});
            await photo.mv(resolve(appRoot, 'public', photoDir, photoName));

            await gameService.editGameById(_id, {
                mainPhoto: `${photoDir}/${photoName}`
            });

            res.end();

        } catch (e) {
            next(e);
        }
    }

    async addGamePictureItem(req: IRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const [photo] = req.photos as any;

            const {_id} = req.game as IGame;
            const randomName = uuid.v4();
            const globalAny = global as any;
            const appRoot = globalAny.appRoot;

            const photoDir = `game/${_id}/pictures`;
            const photoExtension = photo.name.split('.').pop();
            const photoName = `${randomName}.${photoExtension}`;

            fs.mkdirSync(resolve(appRoot, 'public', photoDir), {recursive: true});
            await photo.mv(resolve(appRoot, 'public', photoDir, photoName));

            await gameService.addGameCollectionPhoto(_id, {picture: `${photoDir}/${photoName}`});

            res.end();

        } catch (e) {
            next(e);
        }
    }

    async deleteGamePictureItem(req: IRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const {id:_id} = req.params;

            const picture = await gameService.getGameCollectionPhoto(_id);

            if (!picture){
                throw new ErrorHandler(
                    ResponseStatusCodeEnum.BAD_REQUEST,
                    customErrors.BAD_REQUEST_PHOTO_IS_NOT_PRESENT.message,
                    customErrors.BAD_REQUEST_PHOTO_IS_NOT_PRESENT.code,
                )
            }

            await gameService.deleteGameCollectionPhoto(_id);

            res.end();

        } catch (e) {
            next(e);
        }
    }


    async editGame(req: IRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const {title, description, genre, size, version} = req.body as IGame;
            const {_id: gameId} = req.game as IGame;
            const {_id: userId} = req.user as IUser;

            await gameService.editGameById(gameId, {title, description, genre, size, version});
            await historyService.addEvent({event: `${HistoryEvent.editGame} with id ${gameId}`, userId});

            res.end();

        } catch (e) {
            next(e);
        }
    }

    async deleteGame(req: IRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const {_id: gameId} = req.game as IGame;
            const {_id: userId} = req.user as IUser;

            await gameService.deleteGameById(gameId);
            await historyService.addEvent({event: `${HistoryEvent.deleteGame} with id ${gameId}`, userId});

            res.end();

        } catch (e) {
            next(e);
        }
    }

    async getAllGamesOrGameByName(req: IRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const {name, limit} = req.query;
            let {page = 1} = req.query;
            let games: IGame[] = [];

            if (+page === 0) {
                page = 1;
            }
            page = +page - 1;

            if (!name) {
                games = await gameService.getGames(Number(limit), Number(limit) * +page);
            }
            if (name) {
                games = await gameService.getGamesByName(name as string, Number(limit), Number(limit) * +page);

            }

            if (!games.length) {
                throw new ErrorHandler(
                    ResponseStatusCodeEnum.BAD_REQUEST,
                    customErrors.BAD_REQUEST_GAME_IS_NOT_FOUND.message,
                    customErrors.BAD_REQUEST_GAME_IS_NOT_FOUND.code
                );
            }

            res.json(games);

        } catch (e) {
            next(e);
        }
    }

    async getAvgMark(req: IRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const {_id: gameId} = req.game as IGame;

            const avgMark: any [] = await gameCommentService.getAvgGameMark(gameId);

            if (avgMark.length) {
                await gameService.editGameById(gameId, {rate: avgMark[0].avgMark});

            }
            res.json(avgMark[0]?.avgMark || 0);
        } catch (e) {
            next(e);
        }
    }

}

export const gameController = new GameController();
