import {assetId} from '~/domain/utils/asset.util';
import {assetName} from '~/domain/utils/asset.util';
import {getImageUrlPng} from '~/domain/utils/url.util';
import * as Seed from '~/seed/types';

const gensx = {
  shortName: 'GENSX',
  assetName: assetName('tGENSX'),
  // Minted on Genius Yield preprod wallet at 29.06.2023
  policyId: '4c2bafec6f1977d92bba1906a31eac48485c77b29f05cd9d560dbaa7',
};

export const gensxPreprodAsset: Seed.Asset = {
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
  gensx: gensxPreprodAsset,
};
