import * as Seed from '~/seed/types';
import {assets} from '../asset';

export const project: Seed.Project = {
  projectId: '0c9e5273-9c76-44d8-a4a6-93684a89ba44',

  name: assets.chad.longName,
  imageLogoUrl: assets.chad.iconUrl,

  // set project description
  shortDescription: 'CHAD',
  description: 'CHAD',

  assetId: assets.chad.assetId,
};
