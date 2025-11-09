import * as Seed from '~/seed/types';
import {assets} from '../asset';

export const project: Seed.Project = {
  projectId: 'f355b19a-1bd0-46c3-befe-1eb2066a6fe7',

  name: assets.jpg.longName,
  imageLogoUrl: assets.jpg.iconUrl,

  // set project description
  shortDescription: 'JPG',
  description: 'JPG',

  assetId: assets.jpg.assetId,
};
