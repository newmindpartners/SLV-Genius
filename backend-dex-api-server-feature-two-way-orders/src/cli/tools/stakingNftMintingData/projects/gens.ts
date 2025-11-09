import {CardanoNetwork} from '~/domain/models/cardano';
import {
  stakingNftSubTypes,
  stakingNftTypes,
} from '~/domain/models/private/staking/StakingNft';
import {AssetWithAssetName} from '.';
import {StakingNftSubType, StakingNftType} from '../types';

const ispoNftsPolicyId = {
  s1: {
    diamondHands: '46ca6117ad8645a1fc3fc5f653b552c2211537c46ae71b4362317867',
    ape: '15d4fc88735ba32787b70c9688726a5b2e5848ee82aa7c4a7062c41e',
    fomo: '436a3f05a3894535518b98318b595b0d39d6322ab68183b488a82e55',
    hodler: '394201d726c07e5168daf8e354f1fa0a6c1596e4a0ac447ed94455b3',
    shark: '7b4552699376a48d175c6bc479f5a5b824544a6ffd739564f2118a5a',
    lateFan: '1cfbcac6633f732abe3235ebb932e952bf6b4ff67b7b57a351743588',
    degen: 'ee9c9c1568de2c9c00a7b0bd862a5ab96f488c8c731519178dca121c',
  },
  s2: {
    diamondHands: 'c4524246f08519f41ff65b0311cedf51dc336b99c1fa3ce0e32dd9af',
    ape: 'bdcdb288ff55ecca65dfb979c0e92c2664bfde2f6b1d3874524f214a',
    fomo: '4beca443540203dec3a41a19b325de8c6d383b58724d14ced5e16f57',
    hodler: '0d622dcd603d20f8c2a1b589696d2079374058fa5d3fea67c1eac03d',
    shark: '654bb67ec481937699c4ead7192769b7a510ff4150f44e39644786ad',
    lateFan: 'fd3353c3cfa2260790da67174b014967a2f36c64f3cc2e510990b8fd',
    degen: '85e4f7d75a9e0d46e4cbf944879da6319b018cfeb5886d10912d7d4a',
  },
};

const geniusNftsPolicyId =
  '45505028e69c6bef5db72b657a8011a61a30bb48e1b955f806c417b0';

const mascotNftsPolicyId =
  'ae5e7966d35e154a3b5bdffe5c1b8a1ea981b4c35dd2352fc96766e0';

const ispoPolicyIdToNftSubType = (
  policyId: string
): StakingNftSubType<'GENS'> | null => {
  switch (policyId) {
    case ispoNftsPolicyId.s1.diamondHands:
    case ispoNftsPolicyId.s2.diamondHands:
      return stakingNftSubTypes.GENS.ISPO.DIAMOND_HANDS;
    case ispoNftsPolicyId.s1.ape:
    case ispoNftsPolicyId.s2.ape:
      return stakingNftSubTypes.GENS.ISPO.APE;
    case ispoNftsPolicyId.s1.fomo:
    case ispoNftsPolicyId.s2.fomo:
      return stakingNftSubTypes.GENS.ISPO.FOMO;
    case ispoNftsPolicyId.s1.hodler:
    case ispoNftsPolicyId.s2.hodler:
      return stakingNftSubTypes.GENS.ISPO.HODLER;
    case ispoNftsPolicyId.s1.shark:
    case ispoNftsPolicyId.s2.shark:
      return stakingNftSubTypes.GENS.ISPO.SHARK;
    case ispoNftsPolicyId.s1.lateFan:
    case ispoNftsPolicyId.s2.lateFan:
      return stakingNftSubTypes.GENS.ISPO.LATE_FAN;
    case ispoNftsPolicyId.s1.degen:
    case ispoNftsPolicyId.s2.degen:
      return stakingNftSubTypes.GENS.ISPO.DEGEN;
    default:
      return null;
  }
};

type StakingNftTypeGens = keyof typeof stakingNftTypes.GENS;
export const getGensMintingDataSubType = (
  type: StakingNftTypeGens,
  asset: AssetWithAssetName
): StakingNftSubType<'GENS'> | null => {
  switch (type) {
    case stakingNftTypes.GENS.GENIUS:
      switch (asset.onchain_metadata?.rarity) {
        case 'Common':
          return stakingNftSubTypes.GENS.GENIUS.COMMON;
        case 'Rare':
          return stakingNftSubTypes.GENS.GENIUS.RARE;
        case 'Epic':
          return stakingNftSubTypes.GENS.GENIUS.EPIC;
        case 'Legendary':
          return stakingNftSubTypes.GENS.GENIUS.LEGENDARY;
        default:
          return null;
      }
    case stakingNftTypes.GENS.MASCOT:
      return stakingNftTypes.GENS.MASCOT;
    case stakingNftTypes.GENS.ISPO: {
      return ispoPolicyIdToNftSubType(asset.policy_id);
    }
  }
};

export const isGensStakingType = (type: unknown): type is StakingNftTypeGens =>
  typeof type === 'string' &&
  Object.values(stakingNftTypes.GENS).includes(type as StakingNftTypeGens);

const mainnetNftMintingDataInstructions = [
  {
    policyId: geniusNftsPolicyId,
    type: stakingNftTypes.GENS.GENIUS,
  },
  {
    policyId: mascotNftsPolicyId,
    type: stakingNftTypes.GENS.MASCOT,
  },
  {
    policyId: ispoNftsPolicyId.s1.diamondHands,
    type: stakingNftTypes.GENS.ISPO,
  },
  {
    policyId: ispoNftsPolicyId.s2.diamondHands,
    type: stakingNftTypes.GENS.ISPO,
  },
  {
    policyId: ispoNftsPolicyId.s1.ape,
    type: stakingNftTypes.GENS.ISPO,
  },
  {
    policyId: ispoNftsPolicyId.s2.ape,
    type: stakingNftTypes.GENS.ISPO,
  },
  {
    policyId: ispoNftsPolicyId.s1.fomo,
    type: stakingNftTypes.GENS.ISPO,
  },
  {
    policyId: ispoNftsPolicyId.s2.fomo,
    type: stakingNftTypes.GENS.ISPO,
  },
  {
    policyId: ispoNftsPolicyId.s1.hodler,
    type: stakingNftTypes.GENS.ISPO,
  },
  {
    policyId: ispoNftsPolicyId.s2.hodler,
    type: stakingNftTypes.GENS.ISPO,
  },
  {
    policyId: ispoNftsPolicyId.s1.shark,
    type: stakingNftTypes.GENS.ISPO,
  },
  {
    policyId: ispoNftsPolicyId.s2.shark,
    type: stakingNftTypes.GENS.ISPO,
  },
  {
    policyId: ispoNftsPolicyId.s1.lateFan,
    type: stakingNftTypes.GENS.ISPO,
  },
  {
    policyId: ispoNftsPolicyId.s2.lateFan,
    type: stakingNftTypes.GENS.ISPO,
  },
  {
    policyId: ispoNftsPolicyId.s1.degen,
    type: stakingNftTypes.GENS.ISPO,
  },
  {
    policyId: ispoNftsPolicyId.s2.degen,
    type: stakingNftTypes.GENS.ISPO,
  },
];

export const getNftMintingDataInstructions = (
  network: CardanoNetwork
): {
  policyId: string;
  type: StakingNftType;
}[] => {
  switch (network) {
    case CardanoNetwork.MAINNET:
      return mainnetNftMintingDataInstructions;
    case CardanoNetwork.PREPROD:
    case CardanoNetwork.PREVIEW:
      return [];
  }
};
