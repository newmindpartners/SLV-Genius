import * as Seed from '~/seed/types';
import {assets} from '../asset';

export const project: Seed.Project = {
  projectId: '7d15e2ae-69ef-41d5-86ff-1521681363f3',

  name: assets.opt.longName,
  imageLogoUrl: assets.opt.iconUrl,

  // set project description
  shortDescription: 'OPT',
  description: 'OPT',

  assetId: assets.opt.assetId,
};
