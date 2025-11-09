import * as Seed from '~/seed/types';
import {assets} from '../asset';

export const project: Seed.Project = {
  projectId: 'e3c18b82-2b32-4d00-a2dc-bfc5a2468330',

  name: assets.encs.longName,
  imageLogoUrl: assets.encs.iconUrl,

  // set project description
  shortDescription: 'ENCS',
  description: 'ENCS',

  assetId: assets.encs.assetId,
};
