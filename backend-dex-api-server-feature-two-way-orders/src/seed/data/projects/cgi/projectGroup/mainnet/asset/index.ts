import {getAssetIconUrl} from '~/domain/utils/url.util';
import * as Seed from '~/seed/types';

const assetId = 'asset1yugrazkp73fpwtxefseyrex58an76phaz3v43j';
const shortName = 'CGI';

export const cgiAsset: Seed.Asset = {
  assetId,
  policyId: '2d587111358801114f04df83dc0015de0a740b462b75cce5170fc935',
  assetName: '434749',

  shortName,
  iconUrl: getAssetIconUrl(assetId),
  longName: shortName,

  decimalPrecision: 6,

  webEnabled: true,
};

export const assets = {
  cgi: cgiAsset,
};
