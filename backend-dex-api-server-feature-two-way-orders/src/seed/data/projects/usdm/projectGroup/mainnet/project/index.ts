import * as Seed from '~/seed/types';
import {assets} from '../asset';

export const project: Seed.Project = {
  projectId: '5c27f90a-2a61-43e2-80f0-0412dabec3b1',

  name: assets.usdm.longName,
  imageLogoUrl: assets.usdm.iconUrl,

  // set project description
  shortDescription: 'USDM',
  description: 'USDM',

  assetId: assets.usdm.assetId,
};
