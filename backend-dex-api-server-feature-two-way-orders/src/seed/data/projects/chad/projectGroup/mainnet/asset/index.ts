import {getAssetIconUrl} from '~/domain/utils/url.util';
import * as Seed from '~/seed/types';

const assetId = 'asset1dmqr7kzjw07c4n5c00df0e30nf8l38n4awxwhv';
const shortName = 'CHAD';

export const chadAsset: Seed.Asset = {
  assetId,
  policyId: '97075bf380e65f3c63fb733267adbb7d42eec574428a754d2abca55b',
  assetName: '436861726c6573207468652043686164',

  shortName,
  iconUrl: getAssetIconUrl(assetId),
  longName: shortName,

  decimalPrecision: 0,

  webEnabled: true,
};

export const assets = {
  chad: chadAsset,
};
