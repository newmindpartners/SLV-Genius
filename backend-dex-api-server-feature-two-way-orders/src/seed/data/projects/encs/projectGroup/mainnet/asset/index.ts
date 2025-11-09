import {assetId} from '~/domain/utils/asset.util';
import {getAssetIconUrl} from '~/domain/utils/url.util';
import * as Seed from '~/seed/types';

const assetName = '454e4353';
const policyId = '9abf0afd2f236a19f2842d502d0450cbcd9c79f123a9708f96fd9b96';
const shortName = 'ENCS';

export const encsAsset: Seed.Asset = {
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
  encs: encsAsset,
};
