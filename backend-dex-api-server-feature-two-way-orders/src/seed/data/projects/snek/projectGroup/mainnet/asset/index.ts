import {assetId} from '~/domain/utils/asset.util';
import {getAssetIconUrl} from '~/domain/utils/url.util';
import * as Seed from '~/seed/types';

const assetName = '534e454b';
const policyId = '279c909f348e533da5808898f87f9a14bb2c3dfbbacccd631d927a3f';
const shortName = 'SNEK';

export const snekAsset: Seed.Asset = {
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
  snek: snekAsset,
};
