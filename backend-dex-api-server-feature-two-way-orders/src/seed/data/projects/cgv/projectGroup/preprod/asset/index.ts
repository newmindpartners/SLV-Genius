import {assetId} from '~/domain/utils/asset.util';
import {assetName} from '~/domain/utils/asset.util';
import {getImageUrlPng} from '~/domain/utils/url.util';
import * as Seed from '~/seed/types';

const cgv = {
  shortName: 'CGV',
  assetName: assetName('tCRU'),
  // Minted on Genius Yield preprod wallet at 23.10.2022
  policyId: '432f429b1369039d55cfd0441267ca8a9ec4d696215ac0da009b74ec',
};

export const cgvPreprodAsset: Seed.Asset = {
  assetId: assetId(cgv.policyId, cgv.assetName),
  policyId: cgv.policyId,
  assetName: cgv.assetName,

  shortName: cgv.shortName,
  iconUrl: getImageUrlPng(cgv.shortName),
  longName: 'Cogito Protocol',

  decimalPrecision: 6,

  webEnabled: true,
};

export const assets = {
  cgv: cgvPreprodAsset,
};
