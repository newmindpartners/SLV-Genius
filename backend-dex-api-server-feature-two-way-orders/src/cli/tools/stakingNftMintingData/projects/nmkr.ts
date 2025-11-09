import {CardanoNetwork} from '~/domain/models/cardano';
import {
  stakingNftSubTypes,
  stakingNftTypes,
} from '~/domain/models/private/staking/StakingNft';
import {AssetWithAssetName} from '.';
import {StakingNftSubType, StakingNftType} from '../types';

type StakingNftTypeNmkr = keyof typeof stakingNftTypes.NMKR;

export const getNmkrMintingDataSubType = (
  type: StakingNftTypeNmkr,
  asset: AssetWithAssetName
): StakingNftSubType<'NMKR'> | null => {
  switch (type) {
    case stakingNftTypes.NMKR.SEAPLANE:
      switch (asset.onchain_metadata?.rarity) {
        case 'Bronze':
          return stakingNftSubTypes.NMKR.SEAPLANE.BRONZE;
        case 'Silver':
          return stakingNftSubTypes.NMKR.SEAPLANE.SILVER;
        case 'Gold':
          return stakingNftSubTypes.NMKR.SEAPLANE.GOLD;
        default:
          return null;
      }
  }
};

export const isNmkrStakingType = (type: unknown): type is StakingNftTypeNmkr =>
  typeof type === 'string' &&
  Object.values(stakingNftTypes.NMKR).includes(type as StakingNftTypeNmkr);

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
          policyId: 'f06c76a0bd1bcc12813f63793551aa782b0f7aa59bf1c99ddd5eebff',
          type: stakingNftTypes.NMKR.SEAPLANE,
        },
      ];
    case CardanoNetwork.PREPROD:
      return [
        {
          policyId: '54eb04fb5877aa05df3fdac1b24a25a1fe23b9c037496e5e2d9f0baa',
          type: stakingNftTypes.NMKR.SEAPLANE,
        },
      ];
    case CardanoNetwork.PREVIEW:
      return [];
  }
};
