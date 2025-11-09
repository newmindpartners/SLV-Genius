import * as Seed from '~/seed/types';
import {assets} from '../asset';

export const project: Seed.Project = {
  projectId: '6ea99a05-43b7-47ea-aa0b-95875e14b8a2',

  name: assets.reach.longName,
  imageLogoUrl: assets.reach.iconUrl,

  // set project description
  shortDescription: 'REACH',
  description: 'REACH',

  assetId: assets.reach.assetId,
};
