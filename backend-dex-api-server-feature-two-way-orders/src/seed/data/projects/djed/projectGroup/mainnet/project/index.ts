import * as Seed from '~/seed/types';
import {assets} from '../asset';

export const project: Seed.Project = {
  projectId: '486e4b7b-1885-49ab-a840-1764044609c2',

  name: assets.djed.longName,
  imageLogoUrl: assets.djed.iconUrl,

  // set project description
  shortDescription: 'DJED',
  description: 'DJED',

  assetId: assets.djed.assetId,
};
