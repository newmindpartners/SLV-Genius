import {assetId, assetName} from '~/domain/utils/asset.util';
import {getImageUrlPng} from '~/domain/utils/url.util';
import * as Seed from '~/seed/types';

const ninjaz = {
  shortName: 'NINJAZ',
  assetName: assetName('tCRU'),
  // Minted on Genius Yield preprod wallet at 23.10.2022
  policyId: '432f429b1369039d55cfd0441267ca8a9ec4d696215ac0da009b74ec',
};

export const ninjazAsset: Seed.Asset = {
  assetId: assetId(ninjaz.policyId, ninjaz.assetName),
  policyId: ninjaz.policyId,
  assetName: ninjaz.assetName,

  shortName: ninjaz.shortName,
  iconUrl: getImageUrlPng(ninjaz.shortName),
  longName: 'ninjaz',

  decimalPrecision: 6,

  webEnabled: true,
};

export const assets = {
  ninjaz: ninjazAsset,
};
