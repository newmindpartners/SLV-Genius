import {getAssetIconUrl} from '~/domain/utils/url.util';
import * as Seed from '~/seed/types';
import {assets} from '../asset';

export const project: Seed.Project = {
  projectId: '16431b6a-67a9-4c41-b0c7-5fb27418cc51',

  name: assets.iusd.longName,
  imageLogoUrl: getAssetIconUrl(assets.iusd.shortName),

  // set project description
  shortDescription: 'iUSD',
  description: 'iUSD',

  assetId: assets.iusd.assetId,
};
