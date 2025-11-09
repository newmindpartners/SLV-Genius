import {assetId} from '~/domain/utils/asset.util';
import {getAssetIconUrl} from '~/domain/utils/url.util';
import * as Seed from '~/seed/types';

export const empData = {
  shortName: 'EMP',
  assetName: '74454d50',
  policyId: '171163f05e4f30b6be3c22668c37978e7d508b84f83558e523133cdf',
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
