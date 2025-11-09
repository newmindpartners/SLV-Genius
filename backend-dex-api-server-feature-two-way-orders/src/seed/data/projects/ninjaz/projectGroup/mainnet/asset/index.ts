import {assetId} from '~/domain/utils/asset.util';
import {getImageUrlPng} from '~/domain/utils/url.util';
import * as Seed from '~/seed/types';

const ninjaz = {
  shortName: 'NINJAZ',
  assetName: '0014df104e494e4a415a',
  // Minted on Genius Yield wallet at 08.02.2023
  policyId: 'df1d850c46d6c9d12cbf6181c35db9225a91b77c8a646b7f636f8ae4',
};

export const ninjazAsset: Seed.Asset = {
  assetId: assetId(ninjaz.policyId, ninjaz.assetName),
  policyId: ninjaz.policyId,
  assetName: ninjaz.assetName,

  shortName: ninjaz.shortName,
  iconUrl: getImageUrlPng(ninjaz.shortName),
  longName: 'Danketsu Token',

  decimalPrecision: 6,

  webEnabled: true,
};

export const assets = {
  ninjaz: ninjazAsset,
};
