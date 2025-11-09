import {CardanoNetwork} from '~/domain/models/cardano';
import {
  stakingNftSubTypes,
  stakingNftTypes,
} from '~/domain/models/private/staking/StakingNft';
import {AssetWithAssetName} from '.';
import {StakingNftSubType, StakingNftType} from '../types';

type StakingNftTypeCru = keyof typeof stakingNftTypes.CRU;

export const getCruMintingDataSubType = (
  type: StakingNftTypeCru,
  asset: AssetWithAssetName
): StakingNftSubType<'CRU'> | null => {
  switch (type) {
    case stakingNftTypes.CRU.BOOSTER:
      switch (asset.onchain_metadata?.rarity) {
        case 'super':
          return stakingNftSubTypes.CRU.BOOSTER.SUPER;
        case 'mega':
          return stakingNftSubTypes.CRU.BOOSTER.MEGA;
        case 'ultra':
          return stakingNftSubTypes.CRU.BOOSTER.ULTRA;
        default:
          return null;
      }
    case stakingNftTypes.CRU.ENHANCER:
      return stakingNftSubTypes.CRU.ENHANCER.PRIMARY;
    default:
      return null;
  }
};

export const isCruStakingType = (type: unknown): type is StakingNftTypeCru =>
  typeof type === 'string' &&
  Object.values(stakingNftTypes.CRU).includes(type as StakingNftTypeCru);

export const getNftMintingDataInstructions = (
  network: CardanoNetwork
): {
  policyId: string;
  type: StakingNftType;
}[] => {
  switch (network) {
    case CardanoNetwork.PREPROD:
      return [
        {
          policyId: 'f39ad9cb300b01d8afd4261e7d05fd842032e95b7cb166198b546319',
          type: stakingNftTypes.CRU.BOOSTER,
        },
        {
          policyId: '25ab2f7020b940eecfe36e69bc25c3ce99bdcddfa7e41108bfbc30b7',
          type: stakingNftTypes.CRU.ENHANCER,
        },
      ];
    case CardanoNetwork.MAINNET:
    case CardanoNetwork.PREVIEW:
      return [];
  }
};
