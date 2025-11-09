import * as Seed from '~/seed/types';
import {assets} from '../asset';

export const project: Seed.Project = {
  projectId: '011becca-ed2a-4e74-bf27-ed33777279b4',

  name: assets.mogi.longName,
  imageLogoUrl: assets.mogi.iconUrl,

  // set project description
  shortDescription: 'MOGI',
  description: 'MOGI',

  assetId: assets.mogi.assetId,
};
