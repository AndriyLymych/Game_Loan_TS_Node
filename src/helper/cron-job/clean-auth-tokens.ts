import {schedule} from 'node-cron';

import {authService} from '../../service';
import {IOAuth} from '../../interface';
import {config} from '../../config';

export const cleanAuthTokenTable = () => schedule(config.CRON_PERIOD_FOR_CLEAN_AUTH_TOKENS, async (): Promise<void> => {
  console.log('clean');
  const currentData = new Date().getTime();

  const records: IOAuth[] = await authService.getAllRecords();

  records.forEach(record => {
    const recordData = new Date(record.createdAt).getTime();

    if (currentData - recordData >= config.REFRESH_TOKEN_LIFETIME) {
      authService.dropAuthTokenPairByUserId(record.userId);
    }
  }
  );
});
