import {assetId} from '~/domain/utils/asset.util';
import {getAssetIconUrl} from '~/domain/utils/url.util';
import * as Seed from '~/seed/types';

const assetName = '524a56';
const policyId = '8cfd6893f5f6c1cc954cec1a0a1460841b74da6e7803820dde62bb78';
const shortName = 'RJV';

export const rjvAsset: Seed.Asset = {
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
  rjv: rjvAsset,
};
