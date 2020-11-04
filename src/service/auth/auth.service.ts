import {IOAuth, IUser} from '../../interface';
import {OAuthModel} from '../../database/models';

class AuthService {
  insertAuthTokens(tokenObj: Partial<IOAuth>): Promise<IOAuth> {
    return new OAuthModel(tokenObj).save();
  }

  getUserFromAuthToken(obj: { accessToken?: string, refreshToken?: string }): Promise<IUser | null> {
    return OAuthModel
      .findOne(obj, 'user_id -_id')
      .populate('userId') as any;
  }

  dropAuthTokenPair(token: { accessToken?: string, refreshToken?: string }): Promise<IOAuth | null> {

    return OAuthModel.findOneAndDelete(token).exec();
  }

  dropAuthTokenPairByUserId(userId: string): Promise<IOAuth | null> {

    return OAuthModel.findOneAndDelete({userId}).exec();
  }

}

export const authService = new AuthService();
