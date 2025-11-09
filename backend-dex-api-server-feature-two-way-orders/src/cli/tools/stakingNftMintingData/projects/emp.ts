import {CardanoNetwork} from '~/domain/models/cardano';
import {
  stakingNftTypes,
  stakingNftSubTypes,
} from '~/domain/models/private/staking/StakingNft';
import {AssetWithAssetName} from '.';
import {StakingNftSubType, StakingNftType} from '../types';

type StakingNftTypeEmp = keyof typeof stakingNftTypes.EMP;

export const getEmpMintingDataSubType = (
  type: StakingNftTypeEmp,
  asset: AssetWithAssetName
): StakingNftSubType<'EMP'> | null => {
  switch (type) {
    case stakingNftTypes.EMP.FOUNDING_COMMUNITY:
      switch (asset.onchain_metadata?.privilegeLevel) {
        case 'Team':
          return stakingNftSubTypes.EMP.FOUNDING_COMMUNITY.TEAM;
        case 'Community':
          return stakingNftSubTypes.EMP.FOUNDING_COMMUNITY.COMMUNITY;
        case 'Project Catalyst':
          return stakingNftSubTypes.EMP.FOUNDING_COMMUNITY.PROJECT_CATALYST;
        case 'Premium':
          return stakingNftSubTypes.EMP.FOUNDING_COMMUNITY.PREMIUM;
        default:
          return null;
      }
  }
};

export const isEmpStakingType = (type: unknown): type is StakingNftTypeEmp =>
  typeof type === 'string' &&
  Object.values(stakingNftTypes.EMP).includes(type as StakingNftTypeEmp);

export const getNftMintingDataInstructions = (
  network: CardanoNetwork
): {
  policyId: string;
  type: StakingNftType;
}[] => {
  switch (network) {
    case CardanoNetwork.MAINNET:
      return [
        {
          policyId: 'ccb2b25e5fd18224ea931a3812e5888716d9c08cd8871ff0ab3dc2fa',
          type: stakingNftTypes.EMP.FOUNDING_COMMUNITY,
        },
      ];
    case CardanoNetwork.PREPROD:
      return [
        {
          policyId: '96b38040007f42bb677c16a5ac9162b05db749a48a7cefedabf9ea43',
          type: stakingNftTypes.EMP.FOUNDING_COMMUNITY,
        },
      ];
    case CardanoNetwork.PREVIEW:
      return [];
  }
};
