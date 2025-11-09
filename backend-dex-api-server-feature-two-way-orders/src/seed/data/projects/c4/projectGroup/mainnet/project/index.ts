import * as Seed from '~/seed/types';
import {assets} from '../asset';

export const project: Seed.Project = {
  projectId: '61a5aaf5-f68a-4e00-a02e-a94cb788d105',

  name: assets.c4.longName,
  imageLogoUrl: assets.c4.iconUrl,

  // set project description
  shortDescription: 'C4',
  description: 'C4',

  assetId: assets.c4.assetId,
};
