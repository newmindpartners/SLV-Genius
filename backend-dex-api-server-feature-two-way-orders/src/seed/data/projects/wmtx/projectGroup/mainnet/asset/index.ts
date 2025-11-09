import {getAssetIconUrl} from '~/domain/utils/url.util';
import * as Seed from '~/seed/types';

const assetId = 'asset1l2xup5vr08s07lxg5c4kkj7ur624rv5ayzhyc7';
const shortName = 'WMTX';

export const wmtxAsset: Seed.Asset = {
  assetId,
  policyId: 'e5a42a1a1d3d1da71b0449663c32798725888d2eb0843c4dabeca05a',
  assetName: '576f726c644d6f62696c65546f6b656e58',

  shortName,
  iconUrl: getAssetIconUrl(assetId),
  longName: shortName,

  decimalPrecision: 6,

  webEnabled: true,
};

export const assets = {
  wmtx: wmtxAsset,
};
