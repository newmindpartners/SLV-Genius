import {assetId} from '~/domain/utils/asset.util';
import {getAssetIconUrl} from '~/domain/utils/url.util';
import * as Seed from '~/seed/types';

export const ntxData = {
  shortName: 'NTX',
  assetName: '4e5458',
  policyId: 'edfd7a1d77bcb8b884c474bdc92a16002d1fb720e454fa6e99344479',
};

export const ntxAsset: Seed.Asset = {
  assetId: assetId(ntxData.policyId, ntxData.assetName),
  policyId: ntxData.policyId,
  assetName: ntxData.assetName,

  shortName: ntxData.shortName,
  iconUrl: getAssetIconUrl(ntxData.shortName),
  longName: 'NuNet',

  decimalPrecision: 6,
};

export const assets = {
  ntx: ntxAsset,
};
