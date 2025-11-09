import {getAssetIconUrl} from '~/domain/utils/url.util';
import * as Seed from '~/seed/types';
import {assets} from '../asset';

export const project: Seed.Project = {
  projectId: 'e0aedbd2-20c5-4810-a226-8a827e0bb686',

  name: assets.hosky.longName,
  imageLogoUrl: getAssetIconUrl(assets.hosky.shortName),

  // set project description
  shortDescription: 'HOSKY',
  description: 'HOSKY',

  assetId: assets.hosky.assetId,
};
