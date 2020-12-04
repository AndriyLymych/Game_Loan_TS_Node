import {schedule} from 'node-cron';
import {emailService, userService} from '../../service/';
import {EmailActions, UserStatusEnum} from '../../constant';
import {dayToMilliseconds} from '../day-to-milliseconds';
import {config} from '../../config';

export const unlockUserCronJob = () => schedule(config.CRON_PERIOD_FOR_UNLOCK_USERS, async () => {
  const blockedUsers = await userService.getAllRecords({status: UserStatusEnum.BLOCKED});
  const dateNow = new Date().getTime();

  for (const user of blockedUsers) {
    const blockPeriod = dayToMilliseconds(user.blockPeriod?.period as number);
    const blockTime = new Date(user.blockPeriod?.updatedAt as string).getTime();
    const diff = dateNow - blockTime;

    if (diff >= blockPeriod) {
      await userService.updateUser(user._id, {
        blockPeriod: {period: 0, updatedAt: Date.now().toString()},
        status: UserStatusEnum.CONFIRMED
      });
      await emailService.sendEmail(user.email, EmailActions.UNLOCK_USER, {
        unlockInfo: {
          name: user.name,
          surname: user.surname
        }
      });
    }
  }
});
