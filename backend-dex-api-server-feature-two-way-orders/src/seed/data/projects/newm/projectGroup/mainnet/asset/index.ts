import {assetId} from '~/domain/utils/asset.util';
import {getAssetIconUrl} from '~/domain/utils/url.util';
import * as Seed from '~/seed/types';

const assetName = '4e45574d';
const policyId = '682fe60c9918842b3323c43b5144bc3d52a23bd2fb81345560d73f63';
const shortName = 'NEWM';

export const newmAsset: Seed.Asset = {
  assetId: assetId(policyId, assetName),
  policyId,
  assetName,

  shortName,
  iconUrl: getAssetIconUrl(shortName),
  longName: shortName,

  decimalPrecision: 6,

  webEnabled: true,
};

export const assets = {
  newm: newmAsset,
};
