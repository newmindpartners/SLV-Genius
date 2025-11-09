import {getAssetIconUrl} from '~/domain/utils/url.util';
import * as Seed from '~/seed/types';
import {assets} from '../asset';

export const project: Seed.Project = {
  projectId: '0442ca5a-3f5c-4e16-9172-293dbd256af8',

  name: assets.clay.longName,
  imageLogoUrl: getAssetIconUrl(assets.clay.shortName),

  // set project description
  shortDescription: 'CLAY',
  description: 'CLAY',

  assetId: assets.clay.assetId,
};
