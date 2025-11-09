import {assetId} from '~/domain/utils/asset.util';
import {getAssetIconUrl} from '~/domain/utils/url.util';
import * as Seed from '~/seed/types';

const lenfi = {
  shortName: 'LENFI',
  assetName: '4c454e4649',
  policyId: '0254a6ffa78edb03ea8933dbd4ca078758dbfc0fc6bb0d28b7a9c89f',
};

export const lenfiAsset: Seed.Asset = {
  assetId: assetId(lenfi.policyId, lenfi.assetName),
  policyId: lenfi.policyId,
  assetName: lenfi.assetName,

  shortName: lenfi.shortName,
  iconUrl: getAssetIconUrl(lenfi.shortName),
  longName: 'LENFI',

  decimalPrecision: 6,

  webEnabled: true,
};

export const assets = {
  lenfi: lenfiAsset,
};
