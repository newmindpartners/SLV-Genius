import {CardanoNetwork} from '~/domain/models/cardano';
import {
  stakingNftTypes,
  stakingNftSubTypes,
} from '~/domain/models/private/staking/StakingNft';
import {AssetWithAssetName} from '.';
import {StakingNftSubType, StakingNftType} from '../types';

type StakingNftTypeGensx = keyof typeof stakingNftTypes.GENSX;

export const getGensxMintingDataSubType = (
  type: StakingNftTypeGensx,
  asset: AssetWithAssetName
): StakingNftSubType<'GENSX'> | null => {
  switch (type) {
    case stakingNftTypes.GENSX.VESTA:
      switch (asset.onchain_metadata?.tier) {
        case 'vesta':
          return stakingNftSubTypes.GENSX.VESTA.VESTA;
        default:
          return null;
      }
    case stakingNftTypes.GENSX.COMET:
      switch (asset.onchain_metadata?.tier) {
        case 'Comet':
          return stakingNftSubTypes.GENSX.COMET.COMET;
        default:
          return null;
      }
    case stakingNftTypes.GENSX.TITAN:
      switch (asset.onchain_metadata?.tier) {
        case 'Titan':
          return stakingNftSubTypes.GENSX.TITAN.TITAN;
        default:
          return null;
      }
    case stakingNftTypes.GENSX.GALAXY:
      switch (asset.onchain_metadata?.type) {
        case 'Galaxy':
          return stakingNftSubTypes.GENSX.GALAXY.GALAXY;
        default:
          return null;
      }
  }
};

export const isGensxStakingType = (
  type: unknown
): type is StakingNftTypeGensx =>
  typeof type === 'string' &&
  Object.values(stakingNftTypes.GENSX).includes(type as StakingNftTypeGensx);

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
          policyId: '37ff036927db7fc06b9c98a059abbf0840bb8c832c66107c195d800a',
          type: stakingNftTypes.GENSX.VESTA,
        },
        {
          policyId: 'e93ad5a98870ad8239411d1a44841411aef6e34ca72d2ffd33f5228c',
          type: stakingNftTypes.GENSX.COMET,
        },
        {
          policyId: 'c0cd26dab3d608cdf4d1e3fcae637a5b5fa72189bb65f8fdddfd42be',
          type: stakingNftTypes.GENSX.TITAN,
        },
        {
          policyId: '4fbb7734b341d541fcd6a10319a7d273ed372ad6522ef3eb3245eff1',
          type: stakingNftTypes.GENSX.GALAXY,
        },
      ];
    case CardanoNetwork.PREPROD:
      return [
        {
          policyId: 'b5a3a8f1c8d149ff7aaad3fbd1233b3167210f9b1d8a3b4822e4a759',
          type: stakingNftTypes.GENSX.VESTA,
        },
        {
          policyId: 'd2b76e66cb995595b87e03804fe28c95d01e46de533b89be3da5cea4',
          type: stakingNftTypes.GENSX.COMET,
        },
        {
          policyId: '7c5a2e9d8de412a840f747a8e30f841d3136340948be8b4c8fe59705',
          type: stakingNftTypes.GENSX.TITAN,
        },
        {
          policyId: '8faaf6ab50b964a3ff4b53348f7d694feda62b9078df7ef628a04e82',
          type: stakingNftTypes.GENSX.GALAXY,
        },
      ];
    case CardanoNetwork.PREVIEW:
      return [];
  }
};
