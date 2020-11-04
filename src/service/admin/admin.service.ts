import {IUser} from '../../interface';
import {UserModel} from '../../database/models';

class AdminService {
  blockOrUnlockUser(_id: string, params: Partial<IUser>): Promise<IUser | null> {
    return UserModel.findByIdAndUpdate(_id, params).exec();
  }
}

export const adminService = new AdminService();
