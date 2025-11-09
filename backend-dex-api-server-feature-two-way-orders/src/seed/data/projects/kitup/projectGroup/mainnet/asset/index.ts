import {getAssetIconUrl} from '~/domain/utils/url.util';
import * as Seed from '~/seed/types';

const assetId = 'asset1nzmq5v792nnfhyxe052hkkel9jdc2ucj97mvxq';
const shortName = 'KITUP';

export const kitupAsset: Seed.Asset = {
  assetId,
  policyId: 'b166a1047a8cd275bf0a50201ece3d4f0b4da300094ffcc668a6f408',
  assetName: '4b49545550',

  shortName,
  iconUrl: getAssetIconUrl(assetId),
  longName: shortName,

  decimalPrecision: 0,

  webEnabled: true,
};

export const assets = {
  kitup: kitupAsset,
};
