import * as Seed from '~/seed/types';
import {assets} from '../asset';

export const project: Seed.Project = {
  projectId: 'a4a03479-5900-4fb7-a20b-33cc572d9cc8',

  name: assets.omni.longName,
  imageLogoUrl: assets.omni.iconUrl,

  // set project description
  shortDescription: 'OMNI',
  description: 'OMNI',

  assetId: assets.omni.assetId,
};
