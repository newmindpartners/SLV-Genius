import * as Seed from '~/seed/types';
import {assets} from '../asset';

export const project: Seed.Project = {
  projectId: 'a200a968-e87f-4ba3-a566-c936590fd4b5',

  name: assets.fldt.longName,
  imageLogoUrl: assets.fldt.iconUrl,

  // set project description
  shortDescription: 'FLDT',
  description: 'FLDT',

  assetId: assets.fldt.assetId,
};
