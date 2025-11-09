import {getAssetIconUrl} from '~/domain/utils/url.util';
import {assets} from '../asset';
import * as Seed from '~/seed/types';

export const project: Seed.Project = {
  projectId: '8457b911-d3cd-4562-853d-e7e63df0c00b',
  name: assets.ntx.longName,
  imageLogoUrl: getAssetIconUrl(assets.ntx.shortName),

  shortDescription:
    'A Global Economy of Decentralized Computing. NuNet lets anyone share and monetize their computing resources at scale and provides globally-distributed, optimized computing power for decentralized networks.',
  description:
    'A Global Economy of Decentralized Computing. NuNet lets anyone share and monetize their computing resources at scale and provides globally-distributed, optimized computing power for decentralized networks.',

  websiteUrl: 'https://nunet.io',
  mediaMediumUrl: 'https://medium.com/nunet',
  twitterUrl: 'https://twitter.com/nunet_global?s=20',
  whitePaperUrl:
    'https://docs.nunet.io/nunet-whitepaper/?utm_campaign=Whitepaper+website',

  assetId: assets.ntx.assetId,

  teamMember: [],
};
