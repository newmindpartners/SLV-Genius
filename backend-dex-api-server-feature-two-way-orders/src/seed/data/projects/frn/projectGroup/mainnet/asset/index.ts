import {getAssetIconUrl} from '~/domain/utils/url.util';
import * as Seed from '~/seed/types';

const assetId = 'asset1v9x09ge6qwgfdj4mahd2dztflnzx3szxp3prz8';
const shortName = 'FRN';

export const frnAsset: Seed.Asset = {
  assetId,
  policyId: 'e69eaae4740f240ba9dfffd0ed6b7cb34070efe567e2ec841e3b7562',
  assetName: '46524e',

  shortName,
  iconUrl: getAssetIconUrl(assetId),
  longName: shortName,

  decimalPrecision: 6,

  webEnabled: true,
};

export const assets = {
  frn: frnAsset,
};
