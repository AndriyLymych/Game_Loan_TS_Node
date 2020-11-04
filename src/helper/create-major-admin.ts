import {IUser} from '../interface';
import {config} from '../config';
import {UserGenderEnum, UserRoleEnum, UserStatusEnum} from '../constant';
import {userService} from '../service/user';
import {hashPassword} from './password-hasher';

export const createMajorAdmin = async (): Promise<void> => {

  const globalAdmin: Partial<IUser> = {
    email: config.ROOT_EMAIL,
    password: config.ROOT_EMAIL_PASSWORD,
    name: config.GLOBAL_ADMIN_NAME,
    surname: config.GLOBAL_ADMIN_SURNAME,
    age: config.GLOBAL_ADMIN_AGE as number,
    phone: config.GLOBAL_ADMIN_PHONE,
    role: UserRoleEnum.ADMIN,
    status: UserStatusEnum.CONFIRMED,
    gender: UserGenderEnum.MALE
  };

  const adminExist = await userService.getUserByParams({email: globalAdmin.email});

  if (!adminExist) {
    globalAdmin.password = await hashPassword(globalAdmin.password as string);
    await userService.createUser(globalAdmin);
  }

};
