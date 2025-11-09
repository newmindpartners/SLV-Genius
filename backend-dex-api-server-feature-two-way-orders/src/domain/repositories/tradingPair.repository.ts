import 'reflect-metadata';
import {TransactionalContext} from '~/domain/context';
import * as Private from '~/domain/models/private';

export interface TradingPairRepository {
  listTradingPairs(
    context: TransactionalContext
  ): Promise<Private.PaginatedResults<Private.TradingPair>>;

  getTradingPairByAssetIdPair(
    context: TransactionalContext,
    assetIdPair: [string, string]
  ): Promise<Private.TradingPair | null>;
}
