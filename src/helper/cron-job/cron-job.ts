import {cleanHistoryTable} from './clean-history-table';
import {cleanAuthTokenTable} from './clean-auth-tokens';
import {rememberForLoanFinish} from './remember-for-loan-finish';

export const cronJob = (): void => {
  cleanHistoryTable();
  cleanAuthTokenTable();
  rememberForLoanFinish();
};
