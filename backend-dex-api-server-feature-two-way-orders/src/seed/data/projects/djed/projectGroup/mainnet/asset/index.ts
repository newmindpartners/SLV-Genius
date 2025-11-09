import {assetId} from '~/domain/utils/asset.util';
import {getAssetIconUrl} from '~/domain/utils/url.util';
import * as Seed from '~/seed/types';

const assetName = '446a65644d6963726f555344';
const policyId = '8db269c3ec630e06ae29f74bc39edd1f87c819f1056206e879a1cd61';
const shortName = 'DJED';

export const djedAsset: Seed.Asset = {
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
  djed: djedAsset,
};
