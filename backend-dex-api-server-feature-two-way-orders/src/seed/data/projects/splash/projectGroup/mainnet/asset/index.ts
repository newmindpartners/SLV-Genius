import {getAssetIconUrl} from '~/domain/utils/url.util';
import * as Seed from '~/seed/types';

const assetId = 'asset1cpjgzllu6pt97nzugarfrd4umsc0v2sn8ucfx8';
const shortName = 'SPLASH';

export const splashAsset: Seed.Asset = {
  assetId,
  policyId: 'ececc92aeaaac1f5b665f567b01baec8bc2771804b4c21716a87a4e3',
  assetName: '53504c415348',

  shortName,
  iconUrl: getAssetIconUrl(assetId),
  longName: shortName,

  decimalPrecision: 6,

  webEnabled: true,
};

export const assets = {
  splash: splashAsset,
};
