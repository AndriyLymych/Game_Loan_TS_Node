import {schedule} from 'node-cron';
import {cleanHistoryTable} from './clean-history-table';
import {cleanAuthTokenTable} from './clean-auth-tokens';

export const cronJob = () => schedule('0 0 * * *', async (): Promise<void> => {
  await cleanHistoryTable();
  await cleanAuthTokenTable();

});
