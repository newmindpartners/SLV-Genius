import {assetId} from '~/domain/utils/asset.util';
import {getAssetIconUrl} from '~/domain/utils/url.util';
import * as Seed from '~/seed/types';

const newm = {
  shortName: 'NEWM',
  assetName: '744e45574d',
  policyId: '769c4c6e9bc3ba5406b9b89fb7beb6819e638ff2e2de63f008d5bcff',
};

export const newmAsset: Seed.Asset = {
  assetId: assetId(newm.policyId, newm.assetName),
  policyId: newm.policyId,
  assetName: newm.assetName,

  shortName: newm.shortName,
  iconUrl: getAssetIconUrl(newm.shortName),
  longName: 'NEWM',

  decimalPrecision: 6,

  webEnabled: true,
};

export const assets = {
  newm: newmAsset,
};
