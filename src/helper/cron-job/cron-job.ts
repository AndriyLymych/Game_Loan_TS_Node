import {cleanHistoryTable} from './clean-history-table';
import {cleanAuthTokenTable} from './clean-auth-tokens';
import {rememberForLoanFinish} from './remember-for-loan-finish';

export const cronJob = async (): Promise<void> => {
    await cleanHistoryTable();
    await cleanAuthTokenTable();
    await rememberForLoanFinish();
};
