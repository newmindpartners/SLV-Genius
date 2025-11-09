import * as Seed from '~/seed/types';
import {assets} from '../asset';

export const project: Seed.Project = {
  projectId: 'a1b4bf3f-0ea7-4bcf-838d-06a80be0c0d6',

  name: assets.lifi.longName,
  imageLogoUrl: assets.lifi.iconUrl,

  // set project description
  shortDescription: 'LIFI',
  description: 'LIFI',

  assetId: assets.lifi.assetId,
};
