import {AbstractRequest} from './abstract';

import {Hex} from '~/domain/models/cardano';

export type StakeVaultRequestTemplate = AbstractRequest & {
  stakingAssets: {
    policyId: Hex;
    assetName: Hex;
    assetAmount: number;
  }[];
};

export type StakeVaultCreateRequest = AbstractRequest &
  StakeVaultRequestTemplate & {
    lockedUntil: string;
  };

export interface StakingStakeUnstakeRequest extends AbstractRequest {
  stakeVaultUtxo: string;
}
