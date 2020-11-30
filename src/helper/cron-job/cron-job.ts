import {schedule} from 'node-cron';
// import {cleanHistoryTable} from './clean-history-table';
// import {cleanAuthTokenTable} from './clean-auth-tokens';
import {rememberForLoanFinish} from './remember-for-loan-finish';

export const cronJob = () => schedule('*/5 * * * * *', async (): Promise<void> => {
  // await cleanHistoryTable();
  // await cleanAuthTokenTable();
  await rememberForLoanFinish();
});
