import {getAssetIconUrl} from '~/domain/utils/url.util';
import * as Seed from '~/seed/types';

const assetId = 'asset1tuja02skpjtxyjj9dyapnx4kfjeauvewfc0qn8';
const shortName = 'MNTX';

export const mntxAsset: Seed.Asset = {
  assetId,
  policyId: '77cab21b1a0eb05886cb9fe8e3d297456e53c1d948dba42219a1b380',
  assetName: '4d796e746820546f6b656e2058',

  shortName,
  iconUrl: getAssetIconUrl(assetId),
  longName: shortName,

  decimalPrecision: 6,

  webEnabled: true,
};

export const assets = {
  mntx: mntxAsset,
};
