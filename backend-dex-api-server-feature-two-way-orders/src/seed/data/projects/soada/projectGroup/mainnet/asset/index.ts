import {getAssetIconUrl} from '~/domain/utils/url.util';
import * as Seed from '~/seed/types';

const assetId = 'asset17w8u5d4945e0etjcxtsre77fnxzavl9zg488ky';
const shortName = 'sOADA';

export const soadaAsset: Seed.Asset = {
  assetId,
  policyId: '02a574e2f048e288e2a77f48872bf8ffd61d73f9476ac5a83601610b',
  assetName: '', // This is not a mistake, the assetName of this token is an empty string.

  shortName,
  iconUrl: getAssetIconUrl(assetId),
  longName: shortName,

  decimalPrecision: 6,

  webEnabled: true,
};

export const assets = {
  soada: soadaAsset,
};
