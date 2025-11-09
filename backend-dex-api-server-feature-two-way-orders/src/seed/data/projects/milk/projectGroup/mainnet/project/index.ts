import * as Seed from '~/seed/types';
import {assets} from '../asset';

export const project: Seed.Project = {
  projectId: '8145058a-16df-46b8-ac32-90e93af268b1',

  name: assets.milk.longName,
  imageLogoUrl: assets.milk.iconUrl,

  // set project description
  shortDescription: 'MILK',
  description: 'MILK',

  assetId: assets.milk.assetId,
};
