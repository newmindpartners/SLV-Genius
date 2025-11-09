import * as Seed from '~/seed/types';
import {assets} from '../asset';

export const project: Seed.Project = {
  projectId: 'bce9e85b-b1e0-495f-b24f-faf5250ff260',

  name: assets.fren.longName,
  imageLogoUrl: assets.fren.iconUrl,

  // set project description
  shortDescription: 'FREN',
  description: 'FREN',

  assetId: assets.fren.assetId,
};
