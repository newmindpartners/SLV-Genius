import {assetId} from '~/domain/utils/asset.util';
import {getAssetIconUrl} from '~/domain/utils/url.util';
import * as Seed from '~/seed/types';

const assetName = '494147';
const policyId = '5d16cc1a177b5d9ba9cfa9793b07e60f1fb70fea1f8aef064415d114';
const shortName = 'IAG';

export const iagAsset: Seed.Asset = {
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
  iag: iagAsset,
};
