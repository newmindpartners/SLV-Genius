import {getAssetIconUrl} from '~/domain/utils/url.util';
import * as Seed from '~/seed/types';

const assetId = 'asset16gtljf3uzghxyml9cjh9uvwg5jmcz25gy6kelu';
const shortName = 'AXO';

export const axoAsset: Seed.Asset = {
  assetId,
  policyId: '420000029ad9527271b1b1e3c27ee065c18df70a4a4cfc3093a41a44',
  assetName: '41584f',

  shortName,
  iconUrl: getAssetIconUrl(assetId),
  longName: shortName,

  decimalPrecision: 9,

  webEnabled: true,
};

export const assets = {
  axo: axoAsset,
};
