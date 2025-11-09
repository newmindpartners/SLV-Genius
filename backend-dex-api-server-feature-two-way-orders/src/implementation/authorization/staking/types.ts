import * as Public from '~/domain/models/public';

import {
  StakeVaultCreateContext,
  StakeVaultCreateEligibilityContext,
  StakingNftsContext,
  StakingProjectContext,
} from './context.builders';

import {AuthorizationCheck} from '~/implementation/authorization';

// StakingNftInput type
export type StakingNftInput = Pick<
  Public.StakingNft,
  'type' | 'subType' | 'assetName'
>;

// UniqueStakingNft type
export type UniqueStakingNft = StakingNftInput &
  Pick<Public.StakingNft, 'type' | 'stackableWith'>;

export type StakingEligibilityContext = StakingNftsContext &
  StakeVaultCreateContext &
  StakingProjectContext;

export type StakingAuthorizationCheckTypes =
  | AuthorizationCheck<StakingEligibilityContext>
  | AuthorizationCheck<StakeVaultCreateEligibilityContext>;
