import {getAssetIconUrl} from '~/domain/utils/url.util';
import * as Seed from '~/seed/types';

const assetId = 'asset1yxmhmq2sqddn4vfl0um2dtlg4r7g2p9u9ed6rc';
const shortName = 'XER';

export const xerAsset: Seed.Asset = {
  assetId,
  policyId: '6d06570ddd778ec7c0cca09d381eca194e90c8cffa7582879735dbde',
  assetName: '584552',

  shortName,
  iconUrl: getAssetIconUrl(assetId),
  longName: shortName,

  decimalPrecision: 6,

  webEnabled: true,
};

export const assets = {
  xer: xerAsset,
};
