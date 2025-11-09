import {AbstractRequest, AbstractResponseTransaction} from './abstract';

export type YieldFarmingRewardsRequest = {
  walletStakeKeyHash: string;
};

export type YieldFarmingListRewardsRequest = YieldFarmingRewardsRequest;

export type YieldFarmingListRewardsResponse = {
  lovelaceFlatFee: string;
  rewardsGroups: {
    assets: {
      token: string; // assetName
      symbol: string; // policyId
      amount: string;
    }[];
    group: string; // key in SCREAMING_SNAKE_CASE format
  }[];
};

export type YieldFarmingRewardsClaimRequest = Omit<
  AbstractRequest,
  'collateral'
> &
  YieldFarmingRewardsRequest;

export type YieldFarmingRewardsClaimResponse = AbstractResponseTransaction;
