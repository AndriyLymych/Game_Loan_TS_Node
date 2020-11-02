import {IActionToken, IUser} from '../../interface';
import {UserModel} from '../../database/models';
import {Types} from 'mongoose';

class UserService {
  createUser(user: Partial<IUser>): Promise<IUser> {
    return new UserModel(user).save();
  }

  getUserByParams(params: Partial<IUser>): Promise<IUser | null> {
    return UserModel.findOne(params).exec();
  }

  insertActionToken(id: string, tokenObj: IActionToken): Promise<IUser> {

    return UserModel.updateOne({_id: Types.ObjectId(id)}, {$set: {tokens: [tokenObj]}}, {runValidators: true}).exec();
  }

}

export const userService = new UserService();
