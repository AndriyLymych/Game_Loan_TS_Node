import {historyService} from '../../service';
import {IHistory} from '../../interface';
import {config} from '../../config';

export const cleanHistoryTable = async (): Promise<void> => {
  const currentData = new Date().getTime();

  const records: IHistory[] = await historyService.getAll();

  records.forEach(record => {
    const recordData = new Date(record.createdAt).getTime();

    if (currentData - recordData >= config.CLEAN_HISTORY_TIME) {
      historyService.deleteRecord(record._id);
    }
  });
};
