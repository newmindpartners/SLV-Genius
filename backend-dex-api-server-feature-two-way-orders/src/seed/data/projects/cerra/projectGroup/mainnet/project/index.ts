import * as Seed from '~/seed/types';
import {assets} from '../asset';

export const project: Seed.Project = {
  projectId: 'e6fab214-ceba-4261-9cbd-9636390ae68d',

  name: assets.cerra.longName,
  imageLogoUrl: assets.cerra.iconUrl,

  // set project description
  shortDescription: 'CERRA',
  description: 'CERRA',

  assetId: assets.cerra.assetId,
};
