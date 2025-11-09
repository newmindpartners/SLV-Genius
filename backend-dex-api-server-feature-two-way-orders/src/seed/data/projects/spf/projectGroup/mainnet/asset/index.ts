import {getAssetIconUrl} from '~/domain/utils/url.util';
import * as Seed from '~/seed/types';

const assetId = 'asset1d4awq70afllw8989u999n8dvgvl5wkty5s8wkw';
const shortName = 'SPF';

export const spfAsset: Seed.Asset = {
  assetId,
  policyId: '09f2d4e4a5c3662f4c1e6a7d9600e9605279dbdcedb22d4507cb6e75',
  assetName: '535046',

  shortName,
  iconUrl: getAssetIconUrl(assetId),
  longName: shortName,

  decimalPrecision: 6,

  webEnabled: true,
};

export const assets = {
  spf: spfAsset,
};
