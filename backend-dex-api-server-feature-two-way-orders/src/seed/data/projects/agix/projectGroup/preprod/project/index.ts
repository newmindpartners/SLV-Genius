import {getAssetIconUrl} from '~/domain/utils/url.util';
import * as Seed from '~/seed/types';
import {assets} from '../asset';

export const project: Seed.Project = {
  projectId: 'b801b76d-4b48-454e-939c-aee3c26dcfd7',

  name: assets.agix.longName,
  imageLogoUrl: getAssetIconUrl(assets.agix.shortName),

  // set project description
  shortDescription: 'AGIX',
  description: 'AGIX',

  assetId: assets.agix.assetId,
};
