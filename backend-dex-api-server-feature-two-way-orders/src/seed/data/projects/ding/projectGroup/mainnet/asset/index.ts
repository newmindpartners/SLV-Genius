import {getAssetIconUrl} from '~/domain/utils/url.util';
import * as Seed from '~/seed/types';

const assetId = 'asset1r9e547vystsvmhafennw9g8auh6yzjaknt3rd0';
const shortName = 'DING';

export const dingAsset: Seed.Asset = {
  assetId,
  policyId: 'ce5b9e0f8a88255b65f2e4d065c6e716e9fa9a8a86dfb86423dd1ac0',
  assetName: '44494e47',

  shortName,
  iconUrl: getAssetIconUrl(assetId),
  longName: shortName,

  decimalPrecision: 6,

  webEnabled: true,
};

export const assets = {
  ding: dingAsset,
};
