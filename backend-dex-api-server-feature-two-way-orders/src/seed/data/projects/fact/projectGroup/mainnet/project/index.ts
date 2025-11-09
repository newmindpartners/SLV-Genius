import * as Seed from '~/seed/types';
import {assets} from '../asset';

export const project: Seed.Project = {
  projectId: 'e7bc4104-8256-43b4-887b-e75079490d2c',

  name: assets.fact.longName,
  imageLogoUrl: assets.fact.iconUrl,

  // set project description
  shortDescription: 'FACT',
  description: 'FACT',

  assetId: assets.fact.assetId,
};
