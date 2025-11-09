import {assetId} from '~/domain/utils/asset.util';
import {getAssetIconUrl} from '~/domain/utils/url.util';
import * as Seed from '~/seed/types';

const assetName = '53554e444145';
const policyId = '9a9693a9a37912a5097918f97918d15240c92ab729a0b7c4aa144d77';
const shortName = 'SUNDAE';

export const sundaeAsset: Seed.Asset = {
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
  sundae: sundaeAsset,
};
