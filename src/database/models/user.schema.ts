import {Document, Model, model, Schema} from 'mongoose';

import {IUser} from '../../interface';
import {DbTableNameEnum, UserRoleEnum, UserStatusEnum} from '../../constant';

type UserType = IUser & Document

const tokenSubModel = {
  actionToken: String,
  action: String
};
const blockPeriodSubModel = {
  period: {
    type: Number,
    required: false,
    default: 0
  },
  updatedAt: {
    type: Date,
    default: Date.now()
  }
};

const UserSchema: Schema = new Schema<IUser>({
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  photo: {
    type: String,
    required: false
  },
  name: {
    type: String,
    required: true
  },
  surname: {
    type: String,
    required: true
  },
  age: {
    type: Number,
    required: false
  },
  phone: {
    type: String,
    required: false
  },
  role: {
    type: String,
    required: true,
    default: UserRoleEnum.USER
  },
  gender: {
    type: String,
    required: false
  },
  status: {
    type: String,
    required: true,
    default: UserStatusEnum.PENDING
  },
  blockPeriod: blockPeriodSubModel,
  tokens: [tokenSubModel]
}, {
  timestamps: true
});

export const UserModel: Model<UserType> = model<UserType>(DbTableNameEnum.USER, UserSchema);
