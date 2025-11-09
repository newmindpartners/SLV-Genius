import {getAssetIconUrl} from '~/domain/utils/url.util';
import * as Seed from '~/seed/types';

const assetId = 'asset1guw53kylmfxel4s5zzwr5ac0erz97mfwaq6ur4';
const shortName = 'MNT';

export const mntAsset: Seed.Asset = {
  assetId,
  policyId: '43b07d4037f0d75ee10f9863097463fc02ff3c0b8b705ae61d9c75bf',
  assetName: '4d796e746820546f6b656e',

  shortName,
  iconUrl: getAssetIconUrl(assetId),
  longName: shortName,

  decimalPrecision: 6,

  webEnabled: true,
};

export const assets = {
  mnt: mntAsset,
};
