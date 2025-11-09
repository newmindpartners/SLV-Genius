import {assetId} from '~/domain/utils/asset.util';
import {getAssetIconUrl} from '~/domain/utils/url.util';
import * as Seed from '~/seed/types';

const assetName = '634e455441';
const policyId = 'b34b3ea80060ace9427bda98690a73d33840e27aaa8d6edb7f0c757a';
const shortName = 'cNETA';

export const cnetaAsset: Seed.Asset = {
  assetId: assetId(policyId, assetName),
  policyId,
  assetName,

  shortName,
  iconUrl: getAssetIconUrl(shortName),
  longName: shortName,

  decimalPrecision: 0,

  webEnabled: true,
};

export const assets = {
  cneta: cnetaAsset,
};
