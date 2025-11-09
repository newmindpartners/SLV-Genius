import {getAssetIconUrl} from '~/domain/utils/url.util';
import * as Seed from '~/seed/types';
import {assets} from '../asset';

export const project: Seed.Project = {
  projectId: 'c1c454bb-ebb8-4bda-bdff-d0c653319e9f',

  name: assets.iusd.longName,
  imageLogoUrl: getAssetIconUrl(assets.iusd.shortName),

  // set project description
  shortDescription: 'iUSD',
  description: 'iUSD',

  assetId: assets.iusd.assetId,
};
