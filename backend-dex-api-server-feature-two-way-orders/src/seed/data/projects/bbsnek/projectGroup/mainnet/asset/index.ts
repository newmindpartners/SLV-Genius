import {getAssetIconUrl} from '~/domain/utils/url.util';
import * as Seed from '~/seed/types';

const assetId = 'asset1q5fcz83axysx0snkjtk9e4sm0anye5jwq3cxgy';
const shortName = 'BBSNEK';

export const bbsnekAsset: Seed.Asset = {
  assetId,
  policyId: '7507734918533b3b896241b4704f3d4ce805256b01da6fcede430436',
  assetName: '42616279534e454b',

  shortName,
  iconUrl: getAssetIconUrl(assetId),
  longName: shortName,

  decimalPrecision: 0,

  webEnabled: true,
};

export const assets = {
  bbsnek: bbsnekAsset,
};
