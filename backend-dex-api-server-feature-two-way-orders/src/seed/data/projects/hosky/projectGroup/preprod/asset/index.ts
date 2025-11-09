import {assetId} from '~/domain/utils/asset.util';
import {getAssetIconUrl} from '~/domain/utils/url.util';
import * as Seed from '~/seed/types';

const hosky = {
  shortName: 'HOSKY',
  assetName: '74484f534b59',
  policyId: 'c8dc7113db55c16195f19187030585f0ec24ab3a64722a3627b3a8f1',
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
