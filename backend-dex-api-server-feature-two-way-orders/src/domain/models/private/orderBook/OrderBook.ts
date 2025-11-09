import {OrderBookEntry} from './OrderBookEntry';

export interface OrderBook {
  baseAssetId: string;
  quoteAssetId: string;
  marketPrice: string;
  askOrderBookEntries: OrderBookEntry[];
  bidOrderBookEntries: OrderBookEntry[];
}
