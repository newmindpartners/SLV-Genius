import {assetId} from '~/domain/utils/asset.util';
import {getAssetIconUrl} from '~/domain/utils/url.util';
import * as Seed from '~/seed/types';

const assetName = '4d494c4b';
const policyId = '8a1cfae21368b8bebbbed9800fec304e95cce39a2a57dc35e2e3ebaa';
const shortName = 'MILK';

export const milkAsset: Seed.Asset = {
  assetId: assetId(policyId, assetName),
  policyId,
  assetName,

  shortName,
  iconUrl: getAssetIconUrl(shortName),
  longName: shortName,

  decimalPrecision: 0,

  webEnabled: true,
};

export const assets = {
  milk: milkAsset,
};
