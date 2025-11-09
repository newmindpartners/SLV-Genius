import {getAssetIconUrl} from '~/domain/utils/url.util';
import * as Seed from '~/seed/types';

const assetId = 'asset1ks9vwm65al5xd43n6dvttwcn8xx7xchktra8wr';
const shortName = 'NIKE';

export const nikeAsset: Seed.Asset = {
  assetId,
  policyId: 'c881c20e49dbaca3ff6cef365969354150983230c39520b917f5cf7c',
  assetName: '4e696b65',

  shortName,
  iconUrl: getAssetIconUrl(assetId),
  longName: shortName,

  decimalPrecision: 0,

  webEnabled: true,
};

export const assets = {
  nike: nikeAsset,
};
