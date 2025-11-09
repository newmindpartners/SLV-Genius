import 'reflect-metadata';
import {TransactionalContext} from '~/domain/context';

import * as Private from '~/domain/models/private';

export interface OrderBookRepository {
  getLastNOrderSwapFillsForAssetPair(
    prisma: TransactionalContext,
    baseAssetId: string,
    quoteAssetId: string,
    marketPriceOrderQueryTakeLimit: number
  ): Promise<Private.OrderSwapFill[]>;

  getSortedOpenOrderBookSwapsByAssetIds(
    prisma: TransactionalContext,
    baseAssetId: string,
    quoteAssetId: string
  ): Promise<Private.ValidOrderSwap[]>;
}
