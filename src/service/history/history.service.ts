import {IHistory} from '../../interface';
import {HistoryModel} from '../../database/models/history.schema';

class HistoryService {
  addEvent(historyObj: Partial<IHistory>): Promise<IHistory> {
    return new HistoryModel(historyObj).save();
  }
}

export const historyService = new HistoryService();
