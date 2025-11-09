import * as Seed from '~/seed/types';
import {assets} from '../asset';

export const project: Seed.Project = {
  projectId: '120477f1-e176-4379-b302-93419900b009',

  name: assets.meldNew.longName,
  imageLogoUrl: assets.meldNew.iconUrl,

  // set project description
  shortDescription: 'MELD',
  description: 'MELD',

  assetId: assets.meldNew.assetId,
};
