import * as Seed from '~/seed/types';
import {assets} from '../asset';

export const project: Seed.Project = {
  projectId: '46a0cfcc-2839-430c-a58e-1c5b8125babf',

  name: assets.milk.longName,
  imageLogoUrl: assets.milk.iconUrl,

  // set project description
  shortDescription: 'MILK',
  description: 'MILK',

  assetId: assets.milk.assetId,
};
