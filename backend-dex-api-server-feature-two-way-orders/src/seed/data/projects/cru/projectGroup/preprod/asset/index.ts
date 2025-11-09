import {assetId} from '~/domain/utils/asset.util';
import {assetName} from '~/domain/utils/asset.util';
import {getImageUrlPng} from '~/domain/utils/url.util';
import * as Seed from '~/seed/types';

const cru = {
  shortName: 'CRU',
  assetName: assetName('tCRU'),
  // Minted on Genius Yield preprod wallet at 23.10.2022
  policyId: '432f429b1369039d55cfd0441267ca8a9ec4d696215ac0da009b74ec',
};

export const cruAsset: Seed.Asset = {
  assetId: assetId(cru.policyId, cru.assetName),
  policyId: cru.policyId,
  assetName: cru.assetName,

  shortName: cru.shortName,
  iconUrl: getImageUrlPng(cru.shortName),
  longName: 'Crypto Unicorns',

  decimalPrecision: 6,

  webEnabled: true,
};

export const assets = {
  cru: cruAsset,
};
