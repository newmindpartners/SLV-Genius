import {assetId} from '~/domain/utils/asset.util';
import {getAssetIconUrl} from '~/domain/utils/url.util';
import * as Seed from '~/seed/types';

const assetName = '776f726c646d6f62696c65746f6b656e';
const policyId = '1d7f33bd23d85e1a25d87d86fac4f199c3197a2f7afeb662a0f34e1e';
const shortName = 'WMT';

export const wmtAsset: Seed.Asset = {
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
  wmt: wmtAsset,
};
