import * as Seed from '~/seed/types';
import {assets} from '../asset';

export const project: Seed.Project = {
  projectId: 'cb92d34b-d578-4f79-80ae-d5a4b49ae52c',

  name: assets.oada.longName,
  imageLogoUrl: assets.oada.iconUrl,

  // set project description
  shortDescription: 'OADA',
  description: 'OADA',

  assetId: assets.oada.assetId,
};
