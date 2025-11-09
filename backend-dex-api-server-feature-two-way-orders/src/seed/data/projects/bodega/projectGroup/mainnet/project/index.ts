import * as Seed from '~/seed/types';
import {assets} from '../asset';

export const project: Seed.Project = {
  projectId: '56c43e2a-cb0f-4af7-a73a-c10eed229f84',

  name: assets.bodega.longName,
  imageLogoUrl: assets.bodega.iconUrl,

  // set project description
  shortDescription: 'BODEGA',
  description: 'BODEGA',

  assetId: assets.bodega.assetId,
};
