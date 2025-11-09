import * as Seed from '~/seed/types';
import {assets} from '../asset';

export const project: Seed.Project = {
  projectId: '1eb380d0-8186-46ee-9bcf-20c74e3cc946',

  name: assets.pavia.longName,
  imageLogoUrl: assets.pavia.iconUrl,

  // set project description
  shortDescription: 'PAVIA',
  description: 'PAVIA',

  assetId: assets.pavia.assetId,
};
