import * as Seed from '~/seed/types';
import {assets} from '../asset';

export const project: Seed.Project = {
  projectId: '73627cd6-1944-41ea-8c76-0528b82882dd',

  name: assets.newm.longName,
  imageLogoUrl: assets.newm.iconUrl,

  // set project description
  shortDescription: 'NEWM',
  description: 'NEWM',

  assetId: assets.newm.assetId,
};
