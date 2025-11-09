import 'reflect-metadata';

import {map, reduce} from 'lodash';

import {inject, injectable, singleton} from 'tsyringe';

import {TransactionalContext} from '~/domain/context';

import * as Public from '~/domain/models/public';
import * as Private from '~/domain/models/private';

import {CoreService} from '~/domain/services';
import {AssetRepository} from '~/domain/repositories';
import {DomainMapper} from '~/implementation/prisma/domain.mapper';

import {assetId} from '~/domain/utils/asset.util';
import {YieldFarmingAssetRewards} from '~/domain/models/core';
import {YieldFarmingService} from '~/domain/services/yieldFarming.service';

@singleton()
@injectable()
export class YieldFarmingApplication {
  constructor(
    @inject('CoreService')
    private readonly coreService: CoreService,

    @inject('DomainMapper')
    private readonly domainMapper: DomainMapper,

    @inject('AssetRepository')
    private readonly assetRepository: AssetRepository,

    @inject('YieldFarmingService')
    private readonly yieldFarmingService: YieldFarmingService
  ) {}

  async rewardsClaim(
    user: Private.User,
    walletAccount: Public.WalletAccount
  ): Promise<Public.UnsignedTransaction> {
    const {walletStakeKeyHash} = user;

    const {
      collateralUtxo,
      walletAddress,
      walletUsedAddresses,
      walletUnusedAddresses,
      walletRewardAddresses,
    } = walletAccount;

    const yieldFarmingRewardsClaimUnsignedTransaction =
      await this.coreService.yieldFarmingRewardsClaim({
        walletStakeKeyHash,
        collateralUtxo,
        walletAddress,
        walletUsedAddresses,
        walletUnusedAddresses,
        walletRewardAddresses,
      });

    const {transactionId, transactionPayload} =
      yieldFarmingRewardsClaimUnsignedTransaction;

    return {transactionId, transactionPayload};
  }

  private async coreRewardAssetsToPublicRewardAssets(
    context: TransactionalContext,
    coreRewardAssets: YieldFarmingAssetRewards[]
  ): Promise<Public.YieldFarmingRewardAsset[]> {
    const assetsRewardsByAssetId: Record<string, {assetAmount: string}> =
      reduce(
        coreRewardAssets,
        (assetsIdAmounts, {policyId, assetName, assetAmount}) => ({
          ...assetsIdAmounts,
          [assetId(policyId, assetName)]: {assetAmount},
        }),
        {}
      );

    const listedAssets = await this.assetRepository.getAssetsByAssetIds(
      context,
      Object.keys(assetsRewardsByAssetId)
    );

    const listedAssetsRewards = map(listedAssets, asset => {
      const {assetId} = asset;
      const {assetAmount} = assetsRewardsByAssetId[assetId];
      return {asset, assetAmount};
    });

    // @NOTE results are representative of dex supported assets.
    // Results could be a subset of total rewards returned from core or provided to the user
    const publicRewardAssets = map(
      listedAssetsRewards,
      ({asset, assetAmount}) => ({
        asset: this.domainMapper.toPublicAsset(asset),
        assetAmount,
      })
    );

    return publicRewardAssets;
  }

  async listRewards(
    context: TransactionalContext,
    user: Private.User,
    query: Private.YieldFarmingRewardsQuery
  ): Promise<Public.YieldFarmingRewardsResult> {
    const {walletStakeKeyHash} = user;

    const {rewardsClaimLovelaceServiceFee, rewardsGroups: coreRewardsGroups} =
      await this.coreService.yieldFarmingListRewards({
        walletStakeKeyHash,
        ...query,
      });

    const rewardsGroups: Public.YieldFarmingRewardsResult['rewardsGroups'] =
      await Promise.all(
        coreRewardsGroups.map(async ({assets, groupKey: coreGroupKey}) => {
          const rewardAssets = await this.coreRewardAssetsToPublicRewardAssets(
            context,
            assets
          );

          return Promise.resolve({
            groupName: this.yieldFarmingService.parseCoreGroupKey(coreGroupKey),
            assets: rewardAssets,
          });
        })
      );

    const results: Public.YieldFarmingRewardsResult = {
      rewardsClaimLovelaceServiceFee,
      rewardsGroups,
    };

    return results;
  }
}
