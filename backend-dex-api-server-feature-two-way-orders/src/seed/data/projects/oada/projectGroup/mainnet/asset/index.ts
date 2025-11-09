import {getAssetIconUrl} from '~/domain/utils/url.util';
import * as Seed from '~/seed/types';

const assetId = 'asset1xjqna74gs7kk47zjgn77rpvlkhpkm4l88vh2d2';
const shortName = 'OADA';

export const oadaAsset: Seed.Asset = {
  assetId,
  policyId: 'f6099832f9563e4cf59602b3351c3c5a8a7dda2d44575ef69b82cf8d',
  assetName: '', // This is not a mistake, the assetName of this token is an empty string.

  shortName,
  iconUrl: getAssetIconUrl(assetId),
  longName: shortName,

  decimalPrecision: 6,

  webEnabled: true,
};

export const assets = {
  oada: oadaAsset,
};
