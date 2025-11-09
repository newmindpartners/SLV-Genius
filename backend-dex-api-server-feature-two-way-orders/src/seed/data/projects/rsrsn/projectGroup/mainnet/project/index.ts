import * as Seed from '~/seed/types';
import {assets} from '../asset';

export const project: Seed.Project = {
  projectId: '32ec411b-1399-4ef7-9f65-dcebc0fcb311',

  name: assets.rsrsn.longName,
  imageLogoUrl: assets.rsrsn.iconUrl,

  // set project description
  shortDescription: 'rsRSN',
  description: 'rsRSN',

  assetId: assets.rsrsn.assetId,
};
