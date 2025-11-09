import {assetId} from '~/domain/utils/asset.util';
import {getAssetIconUrl} from '~/domain/utils/url.util';
import * as Seed from '~/seed/types';

export const nmkrData = {
  shortName: 'NMKR',
  assetName: '4e4d4b52',
  policyId: '5dac8536653edc12f6f5e1045d8164b9f59998d3bdc300fc92843489',
};

export const nmkrAsset: Seed.Asset = {
  assetId: assetId(nmkrData.policyId, nmkrData.assetName),
  policyId: nmkrData.policyId,
  assetName: nmkrData.assetName,

  shortName: nmkrData.shortName,
  iconUrl: getAssetIconUrl(nmkrData.shortName),
  longName: 'NMKR',

  decimalPrecision: 6,
};

export const assets = {
  nmkr: nmkrAsset,
};
