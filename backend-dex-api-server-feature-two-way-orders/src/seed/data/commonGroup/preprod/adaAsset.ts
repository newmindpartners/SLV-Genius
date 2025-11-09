import {assetId} from '~/domain/utils/asset.util';
import {getImageUrlPng} from '~/domain/utils/url.util';
import * as Seed from '~/seed/types';

const ADA = 'ADA';

const adaAssetId = assetId('', '');

export const adaAsset: Seed.Asset = {
  assetId: adaAssetId,
  policyId: '',
  assetName: '',

  shortName: ADA,
  longName: 'Cardano',
  iconUrl: getImageUrlPng(ADA),

  decimalPrecision: 6,
};
