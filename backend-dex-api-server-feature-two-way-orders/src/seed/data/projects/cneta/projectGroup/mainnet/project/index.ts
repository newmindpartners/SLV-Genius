import * as Seed from '~/seed/types';
import {assets} from '../asset';

export const project: Seed.Project = {
  projectId: 'a719624a-9a27-40af-879a-5c9d94da81b2',

  name: assets.cneta.longName,
  imageLogoUrl: assets.cneta.iconUrl,

  // set project description
  shortDescription: 'cNETA',
  description: 'cNETA',

  assetId: assets.cneta.assetId,
};
