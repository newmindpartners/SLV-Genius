import * as Seed from '~/seed/types';
import {assets} from '../asset';

export const project: Seed.Project = {
  projectId: 'feb63b43-74d9-48bc-9896-9edf24cf1919',

  name: assets.kitup.longName,
  imageLogoUrl: assets.kitup.iconUrl,

  // set project description
  shortDescription: 'KITUP',
  description: 'KITUP',

  assetId: assets.kitup.assetId,
};
