import {assetId} from '~/domain/utils/asset.util';
import {getAssetIconUrl} from '~/domain/utils/url.util';
import * as Seed from '~/seed/types';

const meld = {
  shortName: 'MELD',
  assetName: '4d454c44',
  policyId: '6ac8ef33b510ec004fe11585f7c5a9f0c07f0c23428ab4f29c1d7d10',
};

export const meldAsset: Seed.Asset = {
  assetId: assetId(meld.policyId, meld.assetName),
  policyId: meld.policyId,
  assetName: meld.assetName,

  shortName: meld.shortName,
  iconUrl: getAssetIconUrl(meld.shortName),
  longName: 'MELD',

  decimalPrecision: 6,

  webEnabled: true,
};

export const assets = {
  meld: meldAsset,
};
