import {NextFunction, Response} from 'express';
import {IRequest, IUser} from '../../interface';
import {comparePassword, hashPassword, tokenCreator} from '../../helper';
import {HistoryEvent, ResponseStatusCodeEnum, TokenActionEnum, UserRoleEnum, UserStatusEnum} from '../../constant';
import {customErrors, ErrorHandler} from '../../errors';
import {historyService, userService} from '../../service';
import {resolve} from 'path';
import * as fs from 'fs';
import * as uuid from 'uuid';

class UserController {
    createUser = (roleType: UserRoleEnum) => async (req: IRequest, res: Response, next: NextFunction) => {
      try {
        const user: IUser = req.body;
        const {email} = user;
        const [photo] = req.photos as any;
        const globalAny: any = global;
        const randomName = uuid.v4();
        const appRoot = globalAny.appRoot;

        const userExist = await userService.getUserByParams({email});

        if (userExist) {
          throw new ErrorHandler(
            ResponseStatusCodeEnum.BAD_REQUEST,
            customErrors.BAD_REQUEST_USER_REGISTERED.message,
            customErrors.BAD_REQUEST_USER_REGISTERED.code
          );
        }
        if (roleType === UserRoleEnum.ADMIN) {
          user.role = UserRoleEnum.ADMIN;
        }
        user.password = await hashPassword(user.password);

        const {access_token} = tokenCreator(TokenActionEnum.REGISTER_USER);

        const {_id} = await userService.createUser(user);

        await userService.insertActionToken(_id, {
          action: TokenActionEnum.REGISTER_USER,
          actionToken: access_token
        });
        await historyService.addEvent({event: HistoryEvent.createUser, userId: _id});
        // await emailService.sendEmail(email, TokenActionEnum.REGISTER_USER, {token: access_token});

        const photoDir = `user/${_id}/avatar`;
        const photoExtension = photo.name.split('.').pop();
        const photoName = `${randomName}.${photoExtension}`;

        await fs.mkdirSync(resolve(appRoot, 'public', photoDir), {recursive: true});

        await photo.mv(resolve(appRoot, 'public', photoDir, photoName));

        await userService.updateUser(_id, {
          photo: `${photoDir}/${photoName}`
        });

        await userService.updateUser(_id, {
          photo: `${photoDir}/${photoName}`
        });
        res.status(ResponseStatusCodeEnum.CREATED).end();

      } catch (e) {
        next(e);
      }
    };

    async updateUserAvatar(req: IRequest, res: Response, next: NextFunction): Promise<void> {
      try {
        const [photo] = req.photos as any;

        const {_id} = req.user;
        const globalAny: any = global;
        const randomName = uuid.v4();
        const appRoot = globalAny.appRoot;

        const photoDir = `user/${_id}/avatar`;
        const photoExtension = photo.name.split('.').pop();
        const photoName = `${randomName}.${photoExtension}`;

        await fs.mkdirSync(resolve(appRoot, 'public', photoDir), {recursive: true});

        await photo.mv(resolve(appRoot, 'public', photoDir, photoName));

        await userService.updateUser(_id, {
          photo: `${photoDir}/${photoName}`
        });

        res.end();

      } catch (e) {
        next(e);
      }
    }

    async confirmUserAccount(req: IRequest, res: Response, next: NextFunction): Promise<void> {
      try {
        const {_id} = req.user as IUser;

        await userService.confirmAccount(_id, UserStatusEnum.CONFIRMED);
        await historyService.addEvent({event: HistoryEvent.confirmAccount, userId: _id});

        res.end();

      } catch (e) {
        next(e);
      }
    }

    async changePassword(req: IRequest, res: Response, next: NextFunction): Promise<void> {
      try {
        const {password, newPassword, newPasswordAgain} = req.body;
        const user = req.user as IUser;

        const isPasswordsEqual = await comparePassword(password, user.password);

        if (!isPasswordsEqual) {
          throw new ErrorHandler(
            ResponseStatusCodeEnum.FORBIDDEN,
            customErrors.FORBIDDEN_WRONG_PASSWORD.message,
            customErrors.FORBIDDEN_WRONG_PASSWORD.code
          );
        }
        if (password === newPassword) {
          throw new ErrorHandler(
            ResponseStatusCodeEnum.FORBIDDEN,
            customErrors.FORBIDDEN_PASSWORD_EQUAL_OLD_PASSWORD.message,
            customErrors.FORBIDDEN_PASSWORD_EQUAL_OLD_PASSWORD.code
          );
        }
        if (newPassword !== newPasswordAgain) {
          throw new ErrorHandler(
            ResponseStatusCodeEnum.FORBIDDEN,
            customErrors.FORBIDDEN_PASSWORDS_NOT_EQUAL.message,
            customErrors.FORBIDDEN_PASSWORDS_NOT_EQUAL.code
          );
        }

        const hashedNewPassword: string = await hashPassword(newPassword);

        await userService.updateUser(user._id, {password: hashedNewPassword});
        await historyService.addEvent({event: HistoryEvent.changePassword, userId: user._id});

        res.status(ResponseStatusCodeEnum.CREATED).end();

      } catch (e) {
        next(e);
      }
    }

    async updateUserProfile(req: IRequest, res: Response, next: NextFunction): Promise<void> {
      try {
        const {gender, phone, name, age, surname} = req.body as IUser;
        const {_id} = req.user as IUser;

        await userService.updateUser(_id, {
          name,
          surname,
          phone,
          gender,
          age
        });

        await historyService.addEvent({event: HistoryEvent.updateUserProfile, userId: _id});

        res.end();
      } catch (e) {
        next(e);
      }
    }

    async findUsersOrUserByName(req: IRequest, res: Response, next: NextFunction): Promise<void> {
      try {
        const {name = '', limit} = req.query;
        let {page = 1} = req.query;

        let users: IUser[] = [];

        if (+page === 0) {
          page = 1;
        }
        page = +page - 1;

        if (!name) {
          users = await userService.getAllUsers(Number(limit), Number(limit) * +page);
        }
        if (name) {
          users = await userService.findUserByNameOrSurname(String(name), Number(limit), Number(limit) * +page);
        }

        if (!users.length) {
          throw new ErrorHandler(
            ResponseStatusCodeEnum.BAD_REQUEST,
            customErrors.BAD_REQUEST_USER_NOT_FOUND.message,
            customErrors.BAD_REQUEST_USER_NOT_FOUND.code
          );
        }

        res.json(users);

      } catch (e) {
        next(e);
      }
    }
}

export const userController = new UserController();
