import * as Seed from '~/seed/types';
import {assets as cgvPreprodAsset} from '../asset';
import {teamMembers} from './teamMembers';

const tokenomicsData = [
  {title: 'Seed Round', amount: 47500000000000},
  {title: 'Private Round', amount: 31250000000000},
  {title: 'Public Round', amount: 28250000000000},
  {title: 'KOL Sales', amount: 4250000000000},
  {title: 'DEX Liquidity', amount: 15000000000000},
  {title: 'Staking & Community Reward', amount: 125000000000000},
  {title: 'Partnership/Network Adoption Fund', amount: 150000000000000},
  {title: 'Team & Advisor', amount: 160000000000000},
  {title: 'Allocation for Incubator (SingularityNET)', amount: 50000000000000},
  {title: 'Ecosystem Development Fund', amount: 388750000000000},
];

const cgvProject: Seed.Project = {
  projectId: '52e6d238-3975-4e14-b980-946dd3fde160',

  name: cgvPreprodAsset.cgv.longName || '',
  imageLogoUrl: cgvPreprodAsset.cgv.iconUrl || '',

  // set project description
  shortDescription:
    'Cogito Protocol offers a "stablecoin-as-as-service" framework that allows for the creation of AI-driven assets known as "tracercoins" powered by SingularityNET.',
  description:
    'The majority of stablecoins are centralized and pegged to fiat with ability to adapt to market dynamics, which makes them vulnerable to increased regulatory risk, inflation, and a single point of failure.' +
    '\n\n' +
    'Cogito Protocol offers GCOIN, a decentralized stablecoin that pegs its value to the green index, which tracks positive progress towards a green economy.  GCOIN presents a slow and steady appreciation while avoiding the vulnerabilities associated with centralized stablecoins.  Cogito leverages artificial intelligence / machine learning (AI/ML) technologies powered by SingularityNET, one of the most reputable blockchain artificial general intelligence (AGI) projects.' +
    '\n\n' +
    'Stablecoin is the primary payment and “cash” holding method in the crypto industry, with a market cap exceeding USD 130 billion and daily trading volume of USD 46 billion, which accounts for 10% of the total crypto market cap and 70% of daily transaction volume.  The major competitors at the moment are simple fiat-pegging stablecoins such as USDC and USDT, or over-collateralized stablecoins such as DAI.  Almost all the current incumbents are centralized (hence not censorship resistant), with fixed value-driving/backing mechanisms which completely ignores market dynamics.',

  // set project media links
  mediaEmail: '',
  websiteUrl: 'https://www.cogitoprotocol.com',
  discordUrl: 'https://discord.gg/8xMJeGQayG',
  mediaMediumUrl: '',
  twitterUrl: 'https://twitter.com/CogitoProtocol',
  whitePaperUrl: 'https://cogito-protocol-2.gitbook.io/whitepaper',
  pitchDeckUrl: '',
  telegramUrl: 'https://t.me/joincogito',
  mediaYoutubeUrl: '',
  privacyPolicyUrl: '',

  // Token utility data
  tokenUtility: {
    description: '',
    items: [
      'index management - adjusting components and weights of indices',
      'Treasury management - regulating the allocation of assets to different investment portfolios',
      'Changing the minting and redemption policy for tracercoins',
      'Voting on launching new tracercoins',
      'Impacting CGV’s buyback-and-burn mechanisms',
    ],
  },

  // set project key features
  keyFeature: [
    {
      title: 'Artificial Intelligence that stabilizes protocol’s mechanisms.',
      description: '',
    },
    {
      title:
        'Research-driven design, which was simulated using stochastic and quantitative methods.',
      description: '',
    },
    {
      title: 'Risk-weighted reserve backing.',
      description: '',
    },
    {
      title:
        'Algorithmic stabilization mechanisms with Capital Adequacy Ratio as Cogito’s foundation.',
      description: '',
    },
  ],

  // set roadmap items
  roadmapItem: [
    {
      title: '2023 Q3',
      roadmapObjectives: ['GCOIN launch'],
      isChecked: false,
    },
    {
      title: '2023 Q4',
      roadmapObjectives: ['GCOIN staking'],
      isChecked: false,
    },
    {
      title: '2024 Q1',
      roadmapObjectives: ['CGV staking'],
      isChecked: false,
    },
    {
      title: '2024 Q2',
      roadmapObjectives: ['Launch green-to-earn campaign'],
      isChecked: false,
    },
    {
      title: '2024 Q3',
      roadmapObjectives: ['Port to Hypercycle'],
      isChecked: false,
    },
    {
      title: '2024 Q4',
      roadmapObjectives: ['Launch XCOIN, 2nd tracercoin'],
      isChecked: false,
    },
  ],

  // set tokenomics pie chart info
  tokenomics: tokenomicsData,

  // set team members
  teamMember: teamMembers,

  assetId: cgvPreprodAsset.cgv.assetId,
};

export const project = cgvProject;
