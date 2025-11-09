import {assetId} from '~/domain/utils/asset.util';
import {getAssetIconUrl} from '~/domain/utils/url.util';
import * as Seed from '~/seed/types';

const assetName = '4652454e';
const policyId = 'fc11a9ef431f81b837736be5f53e4da29b9469c983d07f321262ce61';
const shortName = 'FREN';

export const frenAsset: Seed.Asset = {
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
  fren: frenAsset,
};
