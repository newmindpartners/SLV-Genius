import {assetId} from '~/domain/utils/asset.util';
import {assetName} from '~/domain/utils/asset.util';
import {getImageUrlPng} from '~/domain/utils/url.util';
import * as Seed from '~/seed/types';

const gens = {
  shortName: 'GENS',
  assetName: 'tGENS',
  // Minted on Genius Yield preprod wallet at 23.10.2022
  policyId: 'c6e65ba7878b2f8ea0ad39287d3e2fd256dc5c4160fc19bdf4c4d87e',
};

export const gensAssetPreprod: Seed.Asset = {
  assetId: assetId(gens.policyId, assetName(gens.assetName)),
  policyId: gens.policyId,
  assetName: assetName(gens.assetName),

  shortName: gens.shortName,
  iconUrl: getImageUrlPng(gens.shortName),
  longName: 'Genius Yield',

  decimalPrecision: 6,
};

export const assets = {
  gens: gensAssetPreprod,
};
