import {assetId} from '~/domain/utils/asset.util';
import {getAssetIconUrl} from '~/domain/utils/url.util';
import * as Seed from '~/seed/types';

export const nmkrData = {
  shortName: 'NMKR',
  assetName: '744e4d4b52',
  policyId: '828c6c5c9df5d8493ba505a8db216f8a84d8f9f27ae62c78bba1852c',
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
