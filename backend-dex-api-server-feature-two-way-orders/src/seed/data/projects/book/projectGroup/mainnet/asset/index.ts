import {assetId} from '~/domain/utils/asset.util';
import {getAssetIconUrl} from '~/domain/utils/url.util';
import * as Seed from '~/seed/types';

const assetName = '424f4f4b';
const policyId = '51a5e236c4de3af2b8020442e2a26f454fda3b04cb621c1294a0ef34';
const shortName = 'BOOK';

export const bookAsset: Seed.Asset = {
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
  book: bookAsset,
};
