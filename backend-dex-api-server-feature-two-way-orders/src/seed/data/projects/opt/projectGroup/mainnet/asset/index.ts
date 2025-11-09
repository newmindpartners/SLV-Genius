import {assetId} from '~/domain/utils/asset.util';
import {getAssetIconUrl} from '~/domain/utils/url.util';
import * as Seed from '~/seed/types';

const assetName = '4f5054';
const policyId = '1ddcb9c9de95361565392c5bdff64767492d61a96166cb16094e54be';
const shortName = 'OPT';

export const optAsset: Seed.Asset = {
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
  opt: optAsset,
};
