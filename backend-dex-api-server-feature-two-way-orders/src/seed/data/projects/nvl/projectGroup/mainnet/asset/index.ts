import {getAssetIconUrl} from '~/domain/utils/url.util';
import * as Seed from '~/seed/types';

const assetId = 'asset1jle4pt4cg8264ypx4u45vt99haa6ty3t7naxer';
const shortName = 'NVL';

export const nvlAsset: Seed.Asset = {
  assetId,
  policyId: '5b26e685cc5c9ad630bde3e3cd48c694436671f3d25df53777ca60ef',
  assetName: '4e564c',

  shortName,
  iconUrl: getAssetIconUrl(assetId),
  longName: shortName,

  decimalPrecision: 6,

  webEnabled: true,
};

export const assets = {
  nvl: nvlAsset,
};
