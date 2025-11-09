import * as Seed from '~/seed/types';
import {assets} from '../asset';

export const project: Seed.Project = {
  projectId: '19553c4d-b610-44f5-bf61-526bced46dac',

  name: assets.nike.longName,
  imageLogoUrl: assets.nike.iconUrl,

  // set project description
  shortDescription: 'NIKE',
  description: 'NIKE',

  assetId: assets.nike.assetId,
};
