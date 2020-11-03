import {IActionToken, IUser} from '../../interface';
import {UserModel} from '../../database/models';
import {UserStatusEnum} from '../../constant/user';

class UserService {
  createUser(user: Partial<IUser>): Promise<IUser> {
    return new UserModel(user).save();
  }

  getUserByParams(params: Partial<IUser>): Promise<IUser | null> {
    return UserModel.findOne(params).exec();
  }

  insertActionToken(id: string, tokenObj: IActionToken): Promise<IUser> {
    return UserModel.updateOne({_id: id}, {$set: {tokens: [tokenObj]}}, {runValidators: true}).exec();
  }

  confirmAccount(_id: string, status: UserStatusEnum): Promise<IUser | null> {
    return UserModel.findOneAndUpdate({_id}, {
      $set: {
        status,
        tokens: []
      }
    }, {runValidators: true}).exec();
  }

  getUserFromActionToken(actionToken: string): Promise<IUser | null> {
    return UserModel.findOne({'tokens.actionToken': actionToken}).exec();
  }
}

export const userService = new UserService();
