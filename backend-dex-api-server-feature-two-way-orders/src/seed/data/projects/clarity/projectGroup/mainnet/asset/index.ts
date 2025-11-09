import {getAssetIconUrl} from '~/domain/utils/url.util';
import * as Seed from '~/seed/types';

const assetId = 'asset1y4l8t7fqkqxxm2x4zgj44p7st9c8zpys09pa45';
const shortName = 'CLARITY';

export const clarityAsset: Seed.Asset = {
  assetId,
  policyId: '1e76aaec4869308ef5b61e81ebf229f2e70f75a50223defa087f807b',
  assetName: '436c61726974792044414f20546f6b656e',

  shortName,
  iconUrl: getAssetIconUrl(assetId),
  longName: shortName,

  decimalPrecision: 6,

  webEnabled: true,
};

export const assets = {
  clarity: clarityAsset,
};
