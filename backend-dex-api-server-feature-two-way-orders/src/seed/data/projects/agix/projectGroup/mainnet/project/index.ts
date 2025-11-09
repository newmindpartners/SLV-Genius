import {getAssetIconUrl} from '~/domain/utils/url.util';
import * as Seed from '~/seed/types';
import {assets} from '../asset';

export const project: Seed.Project = {
  projectId: '8b53dd60-0132-4194-9f35-102ec4fa9337',

  name: assets.agix.longName,
  imageLogoUrl: getAssetIconUrl(assets.agix.shortName),

  // set project description
  shortDescription: 'AGIX',
  description: 'AGIX',

  assetId: assets.agix.assetId,
};
