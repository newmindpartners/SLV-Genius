import {getAssetIconUrl} from '~/domain/utils/url.util';
import * as Seed from '~/seed/types';

const assetId = 'asset1vynrwelc3vdyes9cf7777a05h3zukfxz4umppr';
const shortName = 'ANGELS';

export const angelsAsset: Seed.Asset = {
  assetId,
  policyId: '285b65ae63d4fad36321384ec61edfd5187b8194fff89b5abe9876da',
  assetName: '414e47454c53',

  shortName,
  iconUrl: getAssetIconUrl(assetId),
  longName: shortName,

  decimalPrecision: 6,

  webEnabled: true,
};

export const assets = {
  angels: angelsAsset,
};
