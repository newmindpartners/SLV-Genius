import {assetId} from '~/domain/utils/asset.util';
import {getAssetIconUrl} from '~/domain/utils/url.util';
import * as Seed from '~/seed/types';

const assetName = '0014df10464c4454';
const policyId = '577f0b1342f8f8f4aed3388b80a8535812950c7a892495c0ecdf0f1e';
const shortName = 'FLDT';

export const fldtAsset: Seed.Asset = {
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
  fldt: fldtAsset,
};
