import {assetId} from '~/domain/utils/asset.util';
import {getAssetIconUrl} from '~/domain/utils/url.util';
import * as Seed from '~/seed/types';

const hosky = {
  shortName: 'HOSKY',
  assetName: '484f534b59',
  policyId: 'a0028f350aaabe0545fdcb56b039bfb08e4bb4d8c4d7c3c7d481c235',
};

export const hoskyAsset: Seed.Asset = {
  assetId: assetId(hosky.policyId, hosky.assetName),
  policyId: hosky.policyId,
  assetName: hosky.assetName,

  shortName: hosky.shortName,
  iconUrl: getAssetIconUrl(hosky.shortName),
  longName: 'HOSKY',

  decimalPrecision: 0,

  webEnabled: true,
};

export const assets = {
  hosky: hoskyAsset,
};
