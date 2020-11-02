import {HistoryEvent} from '../constant/history';

export interface IHistory {
    _id: string;
    event: HistoryEvent
    userId?: string;
    createdAt: string;
}
