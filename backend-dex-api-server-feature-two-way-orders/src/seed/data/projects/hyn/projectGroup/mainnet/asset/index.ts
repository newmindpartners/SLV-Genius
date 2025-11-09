import {getAssetIconUrl} from '~/domain/utils/url.util';
import * as Seed from '~/seed/types';

const assetId = 'asset1e0euqswqesyrsks53rqfm2pj7gg73wfjn3vpnc';
const shortName = 'HYN';

export const hynAsset: Seed.Asset = {
  assetId,
  policyId: 'fd5a192b76cb73f004edde3993c31f8846845d858fa29a19b8a19869',
  assetName: '48594e',

  shortName,
  iconUrl: getAssetIconUrl(assetId),
  longName: shortName,

  decimalPrecision: 6,

  webEnabled: true,
};

export const assets = {
  hyn: hynAsset,
};
