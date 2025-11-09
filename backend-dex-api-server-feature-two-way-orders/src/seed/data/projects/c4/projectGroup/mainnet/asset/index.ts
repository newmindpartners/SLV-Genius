import {getAssetIconUrl} from '~/domain/utils/url.util';
import * as Seed from '~/seed/types';

const assetId = 'asset1yrhde3lpsl26vrmtx4tjgwmpl2jwxcv35uja3l';
const shortName = 'C4';

export const c4Asset: Seed.Asset = {
  assetId,
  policyId: 'a00fdf4fb9ab6c8c2bd1533a2f14855edf12aed5ecbf96d4b5f5b939',
  assetName: '4334',

  shortName,
  iconUrl: getAssetIconUrl(assetId),
  longName: shortName,

  decimalPrecision: 0,

  webEnabled: true,
};

export const assets = {
  c4: c4Asset,
};
