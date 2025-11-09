// eslint-disable-next-line node/no-unpublished-import
import {BlockFrostAPI} from '@blockfrost/blockfrost-js';

import {Projects, StakingNftSubType, StakingNftType} from '../types';
import {
  getGensMintingDataSubType,
  getNftMintingDataInstructions as getNftMintingDataInstructionsGens,
  isGensStakingType,
} from './gens';
import {
  getCruMintingDataSubType,
  getNftMintingDataInstructions as getNftMintingDataInstructionsCru,
  isCruStakingType,
} from './cru';
import {
  getNftMintingDataInstructions as getNftMintingDataInstructionsNmkr,
  getNmkrMintingDataSubType,
  isNmkrStakingType,
} from './nmkr';
import {
  getEmpMintingDataSubType,
  isEmpStakingType,
  getNftMintingDataInstructions as getNftMintingDataInstructionsEmp,
} from './emp';
import {
  getGensxMintingDataSubType,
  isGensxStakingType,
  getNftMintingDataInstructions as getNftMintingDataInstructionsGensx,
} from './gensx';
import {CardanoNetwork} from '~/domain/models/cardano';

type API = InstanceType<typeof BlockFrostAPI>;
type BlockfrostAsset = Awaited<ReturnType<API['assetsById']>>;

export type AssetWithAssetName = Omit<BlockfrostAsset, 'asset_name'> & {
  asset_name: string;
};

/**
 * These policyId's minted the assets which will be represented
 * in our DB as `StakingNftMintingData`.
 *
 * As a reminder, one `StakingNft` in our app may have many representations
 * on-chain. Such as "GENS Genius Common" NFT which has 6000 on-chain assets.
 * We represent these assets as `StakingNftMintingData`.
 *
 * This policyId is useful for our consuming code to know how to find all
 * on-chain asset should be inserted into our DB in the form of a
 * `StakingNftMintingData` record.
 */
export const getNftMintingDataInstructions = (
  network: CardanoNetwork,
  projectName: Projects
): {
  policyId: string;
  type: StakingNftType;
}[] => {
  switch (projectName) {
    case 'GENS':
      return getNftMintingDataInstructionsGens(network);
    case 'NMKR':
      return getNftMintingDataInstructionsNmkr(network);
    case 'CRU':
      return getNftMintingDataInstructionsCru(network);
    case 'EMP':
      return getNftMintingDataInstructionsEmp(network);
    case 'GENSX':
      return getNftMintingDataInstructionsGensx(network);
  }
};

/**
 * When inserting `StakingNftMintingData` we need to create a FK to a `StakingNft`.
 * We do this by the pair of `type` and `subType`.
 * That's where this function comes in. It looks at the input and determines what
 * `subType` should be.
 */
export const getMintingDataSubType = (
  projectName: Projects,
  type: StakingNftType,
  asset: AssetWithAssetName
): StakingNftSubType | null => {
  switch (projectName) {
    case 'GENS': {
      if (isGensStakingType(type)) {
        return getGensMintingDataSubType(type, asset);
      } else {
        throw Error(`Unexpected StakingNft.type for project ${projectName}`);
      }
    }
    case 'NMKR':
      if (isNmkrStakingType(type)) {
        return getNmkrMintingDataSubType(type, asset);
      } else {
        throw Error(`Unexpected StakingNft.type for project ${projectName}`);
      }
    case 'CRU': {
      if (isCruStakingType(type)) {
        return getCruMintingDataSubType(type, asset);
      } else {
        throw Error(`Unexpected StakingNft.type for project ${projectName}`);
      }
    }
    case 'EMP': {
      if (isEmpStakingType(type)) {
        return getEmpMintingDataSubType(type, asset);
      } else {
        throw Error(`Unexpected StakingNft.type for project ${projectName}`);
      }
    }
    case 'GENSX': {
      if (isGensxStakingType(type)) {
        return getGensxMintingDataSubType(type, asset);
      } else {
        throw Error(`Unexpected StakingNft.type for project ${projectName}`);
      }
    }
  }
};
