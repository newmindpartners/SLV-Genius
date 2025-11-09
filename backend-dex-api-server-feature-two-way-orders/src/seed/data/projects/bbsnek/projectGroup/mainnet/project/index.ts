import * as Seed from '~/seed/types';
import {assets} from '../asset';

export const project: Seed.Project = {
  projectId: 'cad10767-3509-4b75-a0b5-85993af1830a',

  name: assets.bbsnek.longName,
  imageLogoUrl: assets.bbsnek.iconUrl,

  // set project description
  shortDescription: 'BabySNEK',
  description: 'BabySNEK',

  assetId: assets.bbsnek.assetId,
};
