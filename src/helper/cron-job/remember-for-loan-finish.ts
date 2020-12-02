import {schedule} from 'node-cron';

import {emailService, gameService, orderService} from '../../service';
import {EmailActions, GameStatusEnum, OrderStatusEnum} from '../../constant';
import {weekToMillisecondsTransformerHelper} from '../week-to-milliseconds-transformer.helper';
import { config } from '../../config';

let tempStatus = true;

const changeStatus = (): void => {
  tempStatus = false;
};

export const rememberForLoanFinish = async () => schedule(config.CRON_PERIOD_FOR_SEND_MSG_ABOUT_LOAN_FINISH, async (): Promise<void> => {

  const currentData = new Date().getTime();
  const records: any[] = await orderService.findAllOrdersByStatus({status: OrderStatusEnum.ADMITTED});

  for (const record of records) {
    tempStatus = true;
    const orderDate = new Date(record.updatedAt).getTime();
    const diff = currentData - orderDate;
    console.log(diff);
    for (const gameInfo of record.games) {

      const loanTime = weekToMillisecondsTransformerHelper(gameInfo.loan_time as number);

      if (diff >= loanTime && !gameInfo.remember_mail_count) {
        await emailService.sendEmail(
          record.email || record.userId.email,
          EmailActions.FINISH_LOAN, {loanData: gameInfo.gameId.title}
        );
        await gameService.editGameById(gameInfo.gameId._id, {status: GameStatusEnum.AVAILABLE});
        await orderService.incrementRememberMailCount(gameInfo._id);
      }

      if (gameInfo.remember_mail_count === 0) {
        changeStatus();
      }
    }

    if (tempStatus) {

      await orderService.editOrderById(record._id, {status: OrderStatusEnum.FINISHED});
    }
  }

});
