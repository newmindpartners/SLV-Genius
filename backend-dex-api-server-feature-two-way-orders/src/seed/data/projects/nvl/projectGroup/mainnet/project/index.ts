import * as Seed from '~/seed/types';
import {assets} from '../asset';

export const project: Seed.Project = {
  projectId: 'f73068cd-5019-4794-897d-2b571e75a218',

  name: assets.nvl.longName,
  imageLogoUrl: assets.nvl.iconUrl,

  // set project description
  shortDescription: 'NVL',
  description: 'NVL',

  assetId: assets.nvl.assetId,
};
