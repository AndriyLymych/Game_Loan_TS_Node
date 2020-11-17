import {authService} from '../../service';
import {IOAuth} from '../../interface';
import {config} from '../../config';

export const cleanAuthTokenTable = async (): Promise<void> => {
  const currentData = new Date().getTime();

  const records: IOAuth[] = await authService.getAllRecords();

  records.forEach(record => {
    const recordData = new Date(record.createdAt).getTime();

    if (currentData - recordData >= config.REFRESH_TOKEN_LIFETIME) {
      authService.dropAuthTokenPairByUserId(record.userId);
    }
  }
  );
};
