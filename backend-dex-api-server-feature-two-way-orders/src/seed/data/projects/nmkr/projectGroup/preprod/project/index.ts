import {Prisma} from '@prisma/client';
import {getAssetIconUrl} from '~/domain/utils/url.util';
import {assets} from '../asset';

type Project = Omit<Prisma.ProjectUncheckedCreateInput, 'projectId'> &
  Required<Pick<Prisma.ProjectUncheckedCreateInput, 'projectId'>>;

export const project: Project = {
  projectId: '775aca79-cd9f-479d-8e5c-1f7a44dabe57',
  name: assets.nmkr.longName,
  imageLogoUrl: getAssetIconUrl(assets.nmkr.shortName),

  // set project description
  shortDescription:
    'NMKR is a platform which allows you to Create and Sell NFTs on your own website',
  description:
    'NMKR is a platform which allows you to Create and Sell NFTs on your own website',

  // set project media links

  websiteUrl: 'https://www.nmkr.io/',
  mediaMediumUrl: 'https://www.nmkr.io/blog',
  twitterUrl: 'https://twitter.com/nmkr_io',
  whitePaperUrl:
    'https://assets.website-files.com/627424a55a80c8659c58943a/62ab206021a9563ad94edbdb_NMKR-Whitepaper.pdf',

  assetId: assets.nmkr.assetId,

  teamMember: [],
};
