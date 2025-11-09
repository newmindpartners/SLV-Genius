import {assetId} from '~/domain/utils/asset.util';
import {getAssetIconUrl} from '~/domain/utils/url.util';
import * as Seed from '~/seed/types';

const lenfi = {
  shortName: 'LENFI',
  assetName: '41414441',
  policyId: '8fef2d34078659493ce161a6c7fba4b56afefa8535296a5743f69587',
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
