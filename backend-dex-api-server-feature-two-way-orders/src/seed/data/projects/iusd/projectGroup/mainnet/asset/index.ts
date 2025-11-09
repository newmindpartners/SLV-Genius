import {assetId} from '~/domain/utils/asset.util';
import {getAssetIconUrl} from '~/domain/utils/url.util';
import * as Seed from '~/seed/types';

const iusd = {
  shortName: 'iUSD',
  assetName: '69555344',
  policyId: 'f66d78b4a3cb3d37afa0ec36461e51ecbde00f26c8f0a68f94b69880',
};

export const iusdAsset: Seed.Asset = {
  assetId: assetId(iusd.policyId, iusd.assetName),
  policyId: iusd.policyId,
  assetName: iusd.assetName,

  shortName: iusd.shortName,
  iconUrl: getAssetIconUrl(iusd.shortName),
  longName: 'iUSD',

  decimalPrecision: 6,

  webEnabled: true,
};

export const assets = {
  iusd: iusdAsset,
};
