import * as Seed from '~/seed/types';
import {assets} from '../asset';

export const project: Seed.Project = {
  projectId: '7cbf270f-ef50-4244-af9f-1d99d4ff3976',

  name: assets.soc.longName,
  imageLogoUrl: assets.soc.iconUrl,

  // set project description
  shortDescription: 'soc',
  description: 'soc',

  assetId: assets.soc.assetId,
};
