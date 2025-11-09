import * as Seed from '~/seed/types';
import {assets} from '../asset';

export const project: Seed.Project = {
  projectId: '8b2e4db7-ead9-431e-9260-6df07306047c',

  name: assets.cnct.longName,
  imageLogoUrl: assets.cnct.iconUrl,

  // set project description
  shortDescription: 'CNCT',
  description: 'CNCT',

  assetId: assets.cnct.assetId,
};
