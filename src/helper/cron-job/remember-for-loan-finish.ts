import {orderService} from '../../service';
// import {IOrder} from '../../interface';
import {OrderStatusEnum} from '../../constant/order';
import {weekToMillisecondsTransformerHelper} from '../week-to-milliseconds-transformer.helper';

export const rememberForLoanFinish = async (): Promise<void> => {
  // const currentData = new Date().getTime();
  const records: any[] = await orderService.findAllOrdersByStatus({status: OrderStatusEnum.ADMITTED});

  for (const record of records) {

    record.games.map((gameInfo: { loan_time: number; gameId: any; }) => {
      const loanTime = weekToMillisecondsTransformerHelper(gameInfo.loan_time as number);
      console.log(gameInfo.gameId.title,loanTime);
    });
  }
};
