import {AbstractRequest, AbstractResponseTransaction} from './abstract';

type StakingStakeRequest = AbstractRequest;

export interface StakingStakeStakeRequest extends StakingStakeRequest {
  lockedUntil: string;

  value: Record<string, number>;
}

export interface StakingStakeUnstakeRequest extends StakingStakeRequest {
  stakeRef: string;
}

export type StakingStakeStakeResponse = AbstractResponseTransaction;

export type StakingStakeUnstakeResponse = AbstractResponseTransaction;
