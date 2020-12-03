import {cleanHistoryTable} from './clean-history-table';
import {cleanAuthTokenTable} from './clean-auth-tokens';
import {rememberForLoanFinish} from './remember-for-loan-finish';
import { unlockUserCronJob } from './unlock-user-cron-job';

export const cronJob = (): void => {
  cleanHistoryTable();
  cleanAuthTokenTable();
  rememberForLoanFinish();
  unlockUserCronJob();
};
