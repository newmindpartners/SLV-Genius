import * as Seed from '~/seed/types';
import {assets} from '../asset';

export const project: Seed.Project = {
  projectId: 'f9c23181-19c1-4019-9c22-17962f282acd',

  name: assets.frn.longName,
  imageLogoUrl: assets.frn.iconUrl,

  // set project description
  shortDescription: 'FRN',
  description: 'FRN',

  assetId: assets.frn.assetId,
};
