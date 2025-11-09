import * as Seed from '~/seed/types';
import {assets} from '../asset';

export const project: Seed.Project = {
  projectId: '1bcfdd8c-88e2-4203-820f-929cb903b702',

  name: assets.jelly.longName,
  imageLogoUrl: assets.jelly.iconUrl,

  // set project description
  shortDescription: 'JELLY',
  description: 'JELLY',

  assetId: assets.jelly.assetId,
};
