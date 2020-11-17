import {IHistory} from '../../interface';
import {HistoryModel} from '../../database/models';

class HistoryService {
  addEvent(historyObj: Partial<IHistory>): Promise<IHistory> {
    return new HistoryModel(historyObj).save();
  }

  getAll(): Promise<IHistory[]> {
    return HistoryModel.find().exec();
  }

  deleteRecord(_id: string) {
    return HistoryModel.findByIdAndDelete(_id).exec();
  }
}

export const historyService = new HistoryService();
