import * as Seed from '~/seed/types';
import {assets} from '../asset';

export const project: Seed.Project = {
  projectId: 'aec87ec9-3af7-4fd0-a178-b74009d984d7',

  name: assets.usdm.longName,
  imageLogoUrl: assets.usdm.iconUrl,

  // set project description
  shortDescription: 'USDM',
  description: 'USDM',

  assetId: assets.usdm.assetId,
};
