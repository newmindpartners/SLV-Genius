import * as Seed from '~/seed/types';
import {assets} from '../asset';

export const project: Seed.Project = {
  projectId: '16c1bb91-14b8-48b4-824c-133bec64df20',

  name: assets.axo.longName,
  imageLogoUrl: assets.axo.iconUrl,

  // set project description
  shortDescription: 'AXO',
  description: 'AXO',

  assetId: assets.axo.assetId,
};
