import {assetId} from '~/domain/utils/asset.util';
import {getAssetIconUrl} from '~/domain/utils/url.util';
import * as Seed from '~/seed/types';

export const empData = {
  shortName: 'EMP',
  assetName: '456d706f7761',
  policyId: '6c8642400e8437f737eb86df0fc8a8437c760f48592b1ba8f5767e81',
};

export const empAsset: Seed.Asset = {
  assetId: assetId(empData.policyId, empData.assetName),
  policyId: empData.policyId,
  assetName: empData.assetName,

  shortName: empData.shortName,
  iconUrl: getAssetIconUrl(empData.shortName),
  longName: 'Empowa',

  decimalPrecision: 6,
};

export const assets = {
  emp: empAsset,
};
