import {assetId} from '~/domain/utils/asset.util';
import {getAssetIconUrl} from '~/domain/utils/url.util';
import * as Seed from '~/seed/types';

const assetName = '6f7263666178746f6b656e';
const policyId = 'a3931691f5c4e65d01c429e473d0dd24c51afdb6daf88e632a6c1e51';
const shortName = 'FACT';

export const factAsset: Seed.Asset = {
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
  fact: factAsset,
};
