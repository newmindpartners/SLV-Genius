import * as Seed from '~/seed/types';
import {assets} from '../asset';

export const project: Seed.Project = {
  projectId: 'f268efae-c132-42b2-aa4d-ba6a29720390',

  name: assets.chry.longName,
  imageLogoUrl: assets.chry.iconUrl,

  // set project description
  shortDescription: 'chry',
  description: 'chry',

  assetId: assets.chry.assetId,
};
