import {assetId} from '~/domain/utils/asset.util';
import {getImageUrlPng} from '~/domain/utils/url.util';
import * as Seed from '~/seed/types';

const gensx = {
  shortName: 'GENSX',
  assetName: '0014df1047454e5358',
  policyId: 'fbae99b8679369079a7f6f0da14a2cf1c2d6bfd3afdf3a96a64ab67a',
};

export const gensxAsset: Seed.Asset = {
  assetId: assetId(gensx.policyId, gensx.assetName),
  policyId: gensx.policyId,
  assetName: gensx.assetName,

  shortName: gensx.shortName,
  iconUrl: getImageUrlPng(gensx.shortName),
  longName: 'Genius X',

  decimalPrecision: 6,

  webEnabled: true,
};

export const assets = {
  gensx: gensxAsset,
};
