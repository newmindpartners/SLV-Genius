import {assetId} from '~/domain/utils/asset.util';
import {getAssetIconUrl} from '~/domain/utils/url.util';
import * as Seed from '~/seed/types';

const assetName = '4c494649';
const policyId = '7914fae20eb2903ed6fd5021a415c1bd2626b64a2d86a304cb40ff5e';
const shortName = 'LIFI';

export const lifiAsset: Seed.Asset = {
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
  lifi: lifiAsset,
};
