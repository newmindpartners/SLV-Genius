import {assetId} from '~/domain/utils/asset.util';
import {getAssetIconUrl} from '~/domain/utils/url.util';
import * as Seed from '~/seed/types';

const agix = {
  shortName: 'AGIX',
  assetName: '41474958',
  policyId: 'f43a62fdc3965df486de8a0d32fe800963589c41b38946602a0dc535',
};

export const agixAsset: Seed.Asset = {
  assetId: assetId(agix.policyId, agix.assetName),
  policyId: agix.policyId,
  assetName: agix.assetName,

  shortName: agix.shortName,
  iconUrl: getAssetIconUrl(agix.shortName),
  longName: 'AGIX',

  decimalPrecision: 8,

  webEnabled: true,
};

export const assets = {
  agix: agixAsset,
};
