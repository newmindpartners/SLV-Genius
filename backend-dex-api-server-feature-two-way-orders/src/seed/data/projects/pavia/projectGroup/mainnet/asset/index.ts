import {getAssetIconUrl} from '~/domain/utils/url.util';
import * as Seed from '~/seed/types';

const assetId = 'asset1apkt3y69wjyctm94x0eglhx34r9kenx5lg8e06';
const shortName = 'PAVIA';

export const paviaAsset: Seed.Asset = {
  assetId,
  policyId: '884892bcdc360bcef87d6b3f806e7f9cd5ac30d999d49970e7a903ae',
  assetName: '5041564941',

  shortName,
  iconUrl: getAssetIconUrl(assetId),
  longName: 'PAVIA Token',

  decimalPrecision: 0,

  webEnabled: true,
};

export const assets = {
  pavia: paviaAsset,
};
