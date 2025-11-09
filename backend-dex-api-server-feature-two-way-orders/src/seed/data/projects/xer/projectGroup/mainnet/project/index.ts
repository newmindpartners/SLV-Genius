import * as Seed from '~/seed/types';
import {assets} from '../asset';

export const project: Seed.Project = {
  projectId: '9f637af7-58b6-47b3-abc9-d06aa4c860bd',

  name: assets.xer.longName,
  imageLogoUrl: assets.xer.iconUrl,

  // set project description
  shortDescription: 'XER',
  description: 'XER',

  assetId: assets.xer.assetId,
};
