import {getAssetIconUrl} from '~/domain/utils/url.util';
import * as Seed from '~/seed/types';
import {assets} from '../asset';

export const project: Seed.Project = {
  projectId: 'f132a195-a79f-4d06-af4e-c685e1bb0745',

  name: assets.snek.longName,
  imageLogoUrl: getAssetIconUrl(assets.snek.shortName),

  // set project description
  shortDescription: 'SNEK',
  description: 'SNEK',

  assetId: assets.snek.assetId,
};
