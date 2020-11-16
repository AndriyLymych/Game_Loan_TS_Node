import {IGameCredential} from '../../interface';
import {GameCredentialModel} from '../../database/models';

class GameCredentialService {
  addCredentials(credentialObj: Partial<IGameCredential>): Promise<IGameCredential> {
    return new GameCredentialModel(credentialObj).save();
  }

  editCredentials(_id: string, editObj: Partial<IGameCredential>): Promise<IGameCredential | null> {
    return GameCredentialModel.findByIdAndUpdate(_id, editObj).exec();
  }

  deleteCredential(_id: string): Promise<IGameCredential | null> {
    return GameCredentialModel.findByIdAndDelete(_id).exec();
  }

  getCredentialByParams(params: Partial<IGameCredential>): Promise<IGameCredential | null> {
    return GameCredentialModel.findOne(params).exec();
  }
}

export const gameCredentialService = new GameCredentialService();
