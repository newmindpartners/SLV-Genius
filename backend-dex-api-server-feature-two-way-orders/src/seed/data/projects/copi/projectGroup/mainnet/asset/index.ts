import {assetId} from '~/domain/utils/asset.util';
import {getAssetIconUrl} from '~/domain/utils/url.util';
import * as Seed from '~/seed/types';

const assetName =
  '436f726e75636f70696173205b76696120436861696e506f72742e696f5d';
const policyId = 'b6a7467ea1deb012808ef4e87b5ff371e85f7142d7b356a40d9b42a0';
const shortName = 'COPI';

export const copiAsset: Seed.Asset = {
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
  copi: copiAsset,
};
