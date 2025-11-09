import {TransactionalContext} from '~/domain/context';

import * as Private from '~/domain/models/private';

export interface AssetRepository {
  /**
   * Get ADA asset
   *
   * @param context transactional context
   *
   * @return ADA asset
   */
  getAdaAsset(context: TransactionalContext): Promise<Private.Asset>;

  /**
   * Get Asset by assetId
   *
   * @param context transactional context
   * @param assetId asset id
   *
   * @return asset
   */
  getAssetByAssetId(
    context: TransactionalContext,
    assetId: string
  ): Promise<Private.Asset>;

  getAssetOrNullByAssetId(
    context: TransactionalContext,
    assetId: string
  ): Promise<Private.Asset | null>;

  getAssetsByAssetIds(
    context: TransactionalContext,
    assetIds: string[]
  ): Promise<Private.Asset[]>;

  getAssetsMapByAssetIds(
    context: TransactionalContext,
    assetIds: string[]
  ): Promise<Private.AssetsMap>;

  getAssetsByAssetPairIds(
    context: TransactionalContext,
    toAssetId: string,
    fromAssetId: string
  ): Promise<Private.AssetPair>;

  getStakingAssetVesting(
    context: TransactionalContext,
    assetId: string,
    walletStakeKeyHash: string
  ): Promise<bigint | null>;
}
