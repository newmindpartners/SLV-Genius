import {assetId} from '~/domain/utils/asset.util';
import {getAssetIconUrl} from '~/domain/utils/url.util';
import * as Seed from '~/seed/types';

const assetName = '69425443';
const policyId = 'f66d78b4a3cb3d37afa0ec36461e51ecbde00f26c8f0a68f94b69880';
const shortName = 'iBTC';

export const ibtcAsset: Seed.Asset = {
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
  ibtc: ibtcAsset,
};
