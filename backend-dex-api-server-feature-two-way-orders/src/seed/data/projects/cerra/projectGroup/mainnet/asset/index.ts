import {getAssetIconUrl} from '~/domain/utils/url.util';
import * as Seed from '~/seed/types';

const assetId = 'asset1paf79lfu8dmvvxfjlycv0g9g592u6u3equdp3n';
const shortName = 'CERRA';

export const cerraAsset: Seed.Asset = {
  assetId,
  policyId: '4342a3d3c15545a592bf38294dc75c7a1dd3550388303e3a06f4416d',
  assetName: '4345525241',

  shortName,
  iconUrl: getAssetIconUrl(assetId),
  longName: shortName,

  decimalPrecision: 6,

  webEnabled: true,
};

export const assets = {
  cerra: cerraAsset,
};
