import {getAssetIconUrl} from '~/domain/utils/url.util';
import * as Seed from '~/seed/types';

const assetId = 'asset12ffdj8kk2w485sr7a5ekmjjdyecz8ps2cm5zed';
const shortName = 'USDM';

export const usdmAsset: Seed.Asset = {
  assetId,
  policyId: 'c48cbb3d5e57ed56e276bc45f99ab39abe94e6cd7ac39fb402da47ad',
  assetName: '0014df105553444d',

  shortName,
  iconUrl: getAssetIconUrl(assetId),
  longName: shortName,

  decimalPrecision: 6,

  webEnabled: true,
};

export const assets = {
  usdm: usdmAsset,
};
