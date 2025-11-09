import {assetId} from '~/domain/utils/asset.util';
import {getAssetIconUrl} from '~/domain/utils/url.util';
import * as Seed from '~/seed/types';

const agix = {
  shortName: 'AGIX',
  assetName: '7441474958',
  policyId: '1d32893c51b2a88dc034c726a7f1f765539ea739f08950e4fb31e36b',
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
