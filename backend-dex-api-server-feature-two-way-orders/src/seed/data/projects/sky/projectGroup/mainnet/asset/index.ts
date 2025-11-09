import {getAssetIconUrl} from '~/domain/utils/url.util';
import * as Seed from '~/seed/types';

const assetId = 'asset1cvdyyegfm4t3hd56d4xct532e5rtztndzxj75y';
const shortName = 'SKY';

export const skyAsset: Seed.Asset = {
  assetId,
  policyId: '60faa64709fede8dffed0dccb69da337a5bf61eda0c773156ea78b4d',
  assetName: '534b59',

  shortName,
  iconUrl: getAssetIconUrl(assetId),
  longName: shortName,

  decimalPrecision: 6,

  webEnabled: true,
};

export const assets = {
  sky: skyAsset,
};
