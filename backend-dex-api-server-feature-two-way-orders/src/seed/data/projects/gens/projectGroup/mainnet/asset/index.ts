import {assetId} from '~/domain/utils/asset.util';
import {getImageUrlPng} from '~/domain/utils/url.util';
import * as Seed from '~/seed/types';

// Minted on Genius Yield MAINNET
export const gensMainnet = {
  shortName: 'GENS',
  assetName: '0014df1047454e53',
  policyId: 'dda5fdb1002f7389b33e036b6afee82a8189becb6cba852e8b79b4fb',
};

export const gensAsset: Seed.Asset = {
  assetId: assetId(gensMainnet.policyId, gensMainnet.assetName),
  policyId: gensMainnet.policyId,
  assetName: gensMainnet.assetName,

  shortName: gensMainnet.shortName,
  iconUrl: getImageUrlPng(gensMainnet.shortName),
  longName: 'Genius Yield',

  decimalPrecision: 6,
};

export const assets = {
  gens: gensAsset,
};
