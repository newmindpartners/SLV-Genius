import 'reflect-metadata';
import {TransactionalContext} from '~/domain/context';
import * as Private from '~/domain/models/private';

export interface LiquidityPoolRepository {
  /**
   * Get a liquidity pool by it's id
   *
   * @param context transactional context
   * @param liquidityPoolId
   *
   * @return liquidity pool
   **/
  getLiquidityPool(
    context: TransactionalContext,
    liquidityPoolId: string
  ): Promise<Private.LiquidityPool | null>;

  /**
   * Get a liquidity pool by Asset combination
   *
   * @param context transactional context
   * @param assetId id of the assets in lp pair
   *
   * @return liquidity pool
   **/
  getLiquidityPoolByAssets(
    context: TransactionalContext,
    assetIds: String[]
  ): Promise<Private.LiquidityPool | null>;

  /**
   * List liquidity pools
   *
   * @param context transactional context
   * @param query liquidity pool query
   *
   * @return list of paginated liquidity pools
   **/
  listLiquidityPools(
    context: TransactionalContext,
    query: Private.LiquidityPoolQuery,
    prioritiseGens: boolean
  ): Promise<Private.PaginatedResults<Private.LiquidityPool>>;
}
