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

  getUserById(_id: Partial<IUser>): Promise<IUser | null> {
    return UserModel.findById(_id).exec();
  }

  insertActionToken(id: string, tokenObj: IActionToken): Promise<IUser> {
    return UserModel.updateOne({_id: id}, {$set: {tokens: [tokenObj]}}, {runValidators: true}).exec();
  }

  updateUser(_id: string, updateObj: Partial<IUser>): Promise<IUser> {
    return UserModel.updateOne({_id}, {$set: updateObj}).exec();
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

  getAllUsers(limit: number, offset: number): Promise<IUser[]> {
    return UserModel
      .find(
        {},
        {name: 1, surname: 1, status: 1})
      .limit(limit)
      .skip(offset)
      .exec();
  }

  getAllRecords(condition: Partial<IUser>): Promise<IUser[]> {
    return UserModel.find(condition).exec();
  }

  findUserByNameOrSurname(name: string, limit: number, offset: number): Promise<IUser[]> {

    return UserModel.find({
      $or: [
        {name: {$regex: `${name}`, $options: 'i'}},
        {surname: {$regex: `${name}`, $options: 'i'}}
      ]

    }, {name: 1, surname: 1, status: 1})
      .limit(limit)
      .skip(offset)
      .exec();
  }
}

export const userService = new UserService();
