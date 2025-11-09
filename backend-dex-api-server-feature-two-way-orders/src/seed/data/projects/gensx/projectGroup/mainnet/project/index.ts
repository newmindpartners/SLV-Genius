import * as Seed from '~/seed/types';
import {assets as gensxAsset} from '../asset';
import {teamMembers} from './teamMembers';

const tokenomicsData = [
  {title: 'ISPO', amount: 250000000000000},
  {title: 'Seed Round', amount: 35462687000000},
  {title: 'Public Sale', amount: 83300000000000},
  {title: 'Team', amount: 150000000000000},
  {title: 'Marketing & Partnership', amount: 70000000000000},
  {title: 'DAO Treasury', amount: 70000000000000},
  {title: 'Ecosystem Development Fund', amount: 60000000000000},
  {title: 'Grant Program Fund', amount: 141237313000000},
  {title: 'Token Liquidity', amount: 140000000000000},
];

const gensxProject: Seed.Project = {
  projectId: '3329fc1f-a3f3-4c00-a9cf-9f7b4e8b778c',

  name: gensxAsset.gensx.longName || '',
  imageLogoUrl: gensxAsset.gensx.iconUrl || '',

  // set project description
  shortDescription:
    'Genius X is the first and only tokenized, blockchain-agnostic business accelerator and curated launchpad for fully-vetted, early-stage blockchain startups. Genius X’s mission is to create a more decentralized and inclusive future built by the brightest minds utilizing blockchain technology.',
  description:
    'Genius X is the first and only tokenized, blockchain-agnostic business accelerator and curated launchpad for fully-vetted, early-stage blockchain startups. Genius X’s mission is to create a more decentralized and inclusive future built by the brightest minds utilizing blockchain technology.' +
    '\n\n' +
    'The Accelerator program helps ambitious founders turn their vision into reality by building impactful and scalable solutions leveraging blockchain technology. The Genius X team accelerates promising startups by providing advisory support in areas such as marketing, business strategy, token design, and fundraising, giving them the edge to become successful. The Accelerator program started working in the Cardano ecosystem and has by now also expanded onto other vibrant ecosystems, including Polygon and Arbitrum.' +
    '\n\n' +
    'The Genius X launchpad built alongside the Accelerator program simplifies the funding experience by enabling startups to do a public token sale via an Initial DEX Offering (IDO), or a pre-sale, which offers funding access to retail participants. Participants who buy tokens from the Genius X Launchpad will benefit from the diligent and professional curation of quality projects conducted by the Genius X team, instead of a mass market for deals of huge quality range.' +
    '\n\n' +
    'Since the GX Launchpad does not support vesting, the sale will be done in a way where investors will receive via airdrop another fungible token - $GXLA immediately upon completion of the sale process as proof of participation of the $GENSX IDO.  Genius X team will then manually distribute via airdrop the $GENSX  token to investors according to their participation records, and as for the vesting schedule of the $GENSX token, the distribution will be set up via a claim by investors themselves via Tosidrop',

  // set project media links
  mediaEmail: '',
  websiteUrl: 'https://www.genius-x.co',
  discordUrl: 'https://discord.com/invite/G2nP7CuYju',
  mediaMediumUrl: '',
  twitterUrl: 'https://twitter.com/OfficialGeniusx',
  whitePaperUrl:
    'https://genius-x.gitbook.io/genius-x-whitepaper-v.-0.1/introduction/about-genius-x',
  pitchDeckUrl: '',
  telegramUrl: 'https://t.me/geniusX_official',
  mediaYoutubeUrl: 'https://www.youtube.com/@GeniusXOfficial',
  privacyPolicyUrl: '',

  // Token utility data
  tokenUtility: {
    description:
      '$GENSX is the utility and governance token for the Genius X platform. There will be a maximum supply of 1 billion $GENSX tokens.  By staking the token in the $GENSX staking program, holders can maximize their utility in the Genius X ecosystem in the following ways:',
    items: [
      'Staking Rewards - $GENSX holders who stake their tokens in the Genius X Staking Program can earn additional $GENSX rewards, which come from:\n\t20% of Genius X Launchpad fees, which is typically a % of the amount of funds raised by projects doing IDO on the Genius X Launchpad; and\n\t20% of Genius X Accelerator Program fees earned by the Genius X Accelerator Program, which typically includes a % of the total token supply of the projects that join the Genius X Accelerator Program or benefit from any of the services provided by the Genius X Accelerator Program, and a % of amount of funds raised by those projects from private investors with the support of Genius X.',
      'Governance rights - The Genius X Staking Program gives $GENSX holders governance rights over the protocol, which will eventually allow you to vote on Genius X Improvement Proposals (GIPs). GIPs, like Ethereum Improvement Proposals and Cardano Improvement Proposals, are formal proposals that update the functionality or a feature of the protocol. The implementation of GIPs will be decided by the Genius X community, or those in the Genius X Staking Program.\n\tThese governance rights will culminate into the creation of a DAO, or decentralized autonomous organization, for the Genius X platform. Funds in the DAO Treasury will eventually be controlled by $GENSX holders in the Genius X Staking Program.',
    ],
  },

  // set project key features
  keyFeature: [
    {
      title: 'Tokenized Accelerator',
      description:
        'Web3 industry’s first & only tokenized accelerator, where $GENSX token stakers separately receive a share of the accelerator’s portfolio value (or all the project tokens earned by the accelerator)',
    },
    {
      title: 'Evergreen and personalized acceleration',
      description:
        'to ensure that Genius X can attract the best quality projects, it provides a unique evergreen, and personalized acceleration services to maximize the potential value added by Genius X to its partner projects/portfolio companies',
    },
    {
      title: 'Unique synergies between Launchpad and Accelerator',
      description:
        'Most (if not all) launchpad projects start from working with the Genius X accelerator, which will ensure an extra level of quality assurance for the community on most of the IDOs that will be launched on the Genius X Launchpad ',
    },
    {
      title: 'Established and Proven Business Model',
      description:
        'The Genius X accelerator has already been working with 10+ Web3 startup projects with some of them starting to launch tokens (of which a share will be received from the potential $GENSX token stakers), and the Genius X Launchpad has already held several successful IDOs. ',
    },
  ],

  // set roadmap items
  roadmapItem: [
    {
      title: '2023 / H1',
      roadmapObjectives: [
        'Multi-Token ISPO by Genius X Ends',
        'Genius X Accelerator Becomes Blockchain Agnostic',
        'Onboarding New Startups',
        '$GENSX Token Public Sale',
        '$GENSX Token TGE',
      ],
      isChecked: false,
    },
    {
      title: '2023 / H2',
      roadmapObjectives: [
        '$GENSX and Genius X NFTs Staking',
        '$GENSX ISPO - First 50% of $GENSX Airdropped',
        'Building Presence on Polygon and Arbitrum',
        'Onboarding New Startups',
      ],
      isChecked: false,
    },
    {
      title: '2024',
      roadmapObjectives: [
        'Equity Crowdfunding on Genius X Launchpad',
        'Expanding Genius X Launchpad to Other Ecosystems',
        'Onboarding New Startups',
        'Establishing Accelerator Partnerships in Various Ecosystems',
      ],
      isChecked: false,
    },
  ],

  // set tokenomics pie chart info
  tokenomics: tokenomicsData,

  // set team members
  teamMember: teamMembers,

  assetId: gensxAsset.gensx.assetId,
};

export const project = gensxProject;
