import {IGame, IGameCredential, IRequest, IUser} from '../../interface';
import {NextFunction, Response} from 'express';
import {gameCredentialService, gameService, historyService} from '../../service';
import {customErrors, ErrorHandler} from '../../errors';
import {HistoryEvent, ResponseStatusCodeEnum} from '../../constant';

class GameCredentialController {
    async addCredential(req: IRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const {login, password, gameId} = req.body as IGameCredential;
            const {_id} = req.user as IUser;

            const isCredentialExists = await gameCredentialService.getCredentialByParams({login});

            if (isCredentialExists) {
                throw new ErrorHandler(
                    ResponseStatusCodeEnum.BAD_REQUEST,
                    customErrors.BAD_REQUEST_CREDENTIALS_IS_ALREADY_EXISTS.message,
                    customErrors.BAD_REQUEST_CREDENTIALS_IS_ALREADY_EXISTS.code
                );
            }

            const gameExists = await gameService.getGameById(gameId as Partial<IGame>);

            if (!gameExists) {

                throw new ErrorHandler(
                    ResponseStatusCodeEnum.BAD_REQUEST,
                    customErrors.BAD_REQUEST_GAME_IS_NOT_FOUND.message,
                    customErrors.BAD_REQUEST_GAME_IS_NOT_FOUND.code
                );
            }

            await gameCredentialService.addCredentials({login, password, gameId});
            await historyService.addEvent({
                event: `${HistoryEvent.addGameCredentials} for game with id: ${gameId}`,
                userId: _id
            });

            res.status(ResponseStatusCodeEnum.CREATED).end();

        } catch (e) {
            next(e);
        }
    }

    async editCredential(req: IRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const {login, password, gameId} = req.body as IGameCredential;
            const {_id} = req.credentials as IGameCredential;
            const {_id: userId} = req.user as IUser;

            await gameCredentialService.editCredentials(_id, {login, password, gameId});
            await historyService.addEvent({
                event: `${HistoryEvent.addGameCredentials} for game with id: ${gameId}`,
                userId
            });

            res.end();

        } catch (e) {
            next(e);
        }
    }

    async deleteCredential(req: IRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const {_id, gameId} = req.credentials as IGameCredential;
            const {_id: userId} = req.user as IUser;

            await gameCredentialService.deleteCredential(_id);
            await historyService.addEvent({
                event: `${HistoryEvent.deleteGameCredentials} for game with id: ${gameId}`,
                userId
            });

            res.end();

        } catch (e) {
            next(e);
        }
    }

}

export const gameCredentialController = new GameCredentialController();
