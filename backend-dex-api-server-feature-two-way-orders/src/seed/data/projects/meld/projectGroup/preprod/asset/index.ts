import {assetId} from '~/domain/utils/asset.util';
import {getAssetIconUrl} from '~/domain/utils/url.util';
import * as Seed from '~/seed/types';

const meld = {
  shortName: 'MELD',
  assetName: '744d454c44',
  policyId: '66a524d7f34d954a3ad30b4e2d08023c950dfcd53bbe3c2314995da6',
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
