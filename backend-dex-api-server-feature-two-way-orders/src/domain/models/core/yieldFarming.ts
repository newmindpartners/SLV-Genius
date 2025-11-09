import {AbstractRequest} from './abstract';

export type YieldFarmingRewardsRequest = {
  walletStakeKeyHash: string;
};

export type YieldFarmingListRewardsRequest = YieldFarmingRewardsRequest;

export type YieldFarmingAsset = {
  policyId: string;
  assetName: string;
};

export type YieldFarmingAssetRewards = YieldFarmingAsset & {
  assetAmount: string;
};

export type YieldFarmingListRewardsResponse = {
  rewardsClaimLovelaceServiceFee: string;
  rewardsGroups: {
    assets: YieldFarmingAssetRewards[];
    groupKey: string;
  }[];
};

export type YieldFarmingRewardsClaimRequest = AbstractRequest &
  YieldFarmingRewardsRequest;
