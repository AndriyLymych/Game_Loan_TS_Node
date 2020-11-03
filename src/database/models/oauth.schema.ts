import {IOAuth} from '../../interface/oauth.interface';
import {Document, model, Model, Schema} from 'mongoose';
import {DbTableNameEnum} from '../../constant/db';

type OAuthType = IOAuth & Document;

const OAuthSchema: Schema = new Schema<IOAuth>({
  accessToken: {
    type: String,
    required: true
  },
  refreshToken: {
    type: String,
    required: true
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: DbTableNameEnum.USER,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now()
  }
});

export const OAuthModel: Model<OAuthType> = model<OAuthType>(DbTableNameEnum.OAUTH, OAuthSchema);
