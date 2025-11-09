import * as Private from '~/domain/models/private';
import {OrderBookEntryType} from './OrderBookEntryType';

export type OrderBookEntry = {
  orderBookEntryType: OrderBookEntryType;
  order: Private.ValidOrderSwap;
};
