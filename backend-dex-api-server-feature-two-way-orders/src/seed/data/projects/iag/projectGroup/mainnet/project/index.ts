import * as Seed from '~/seed/types';
import {assets} from '../asset';

export const project: Seed.Project = {
  projectId: '0ed41230-affb-41e7-a649-f39dc3308623',

  name: assets.iag.longName,
  imageLogoUrl: assets.iag.iconUrl,

  // set project description
  shortDescription: 'IAG',
  description: 'IAG',

  assetId: assets.iag.assetId,
};
