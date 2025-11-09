import {assetId} from '~/domain/utils/asset.util';
import {getAssetIconUrl} from '~/domain/utils/url.util';
import * as Seed from '~/seed/types';

const clay = {
  shortName: 'CLAY',
  assetName: '74434c4159',
  policyId: '0afaa69ead213cbeedc2ec842efd233aa9724e2825ae42d1b3b35f94',
};

export const clayAsset: Seed.Asset = {
  assetId: assetId(clay.policyId, clay.assetName),
  policyId: clay.policyId,
  assetName: clay.assetName,

  shortName: clay.shortName,
  iconUrl: getAssetIconUrl(clay.shortName),
  longName: 'CLAY',

  decimalPrecision: 4,

  webEnabled: true,
};

export const assets = {
  clay: clayAsset,
};
