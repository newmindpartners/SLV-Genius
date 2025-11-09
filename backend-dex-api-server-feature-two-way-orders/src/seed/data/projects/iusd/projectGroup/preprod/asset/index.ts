import {assetId} from '~/domain/utils/asset.util';
import {getAssetIconUrl} from '~/domain/utils/url.util';
import * as Seed from '~/seed/types';

const iusd = {
  shortName: 'iUSD',
  assetName: '7469555344',
  policyId: '4a8bb5b64bfd88340f3f984a856e90de6d7e6969427aa3688bf055c5',
};

export const iusdAsset: Seed.Asset = {
  assetId: assetId(iusd.policyId, iusd.assetName),
  policyId: iusd.policyId,
  assetName: iusd.assetName,

  shortName: iusd.shortName,
  iconUrl: getAssetIconUrl(iusd.shortName),
  longName: 'iUSD',

  decimalPrecision: 6,

  webEnabled: true,
};

export const assets = {
  iusd: iusdAsset,
};
