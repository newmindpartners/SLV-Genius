import * as Seed from '~/seed/types';
import {assets as cruAssetsPreprod} from '../asset';

const tokenomicsData = [
  {title: 'Seed Round', amount: 20000000000},
  {title: 'ISPO', amount: 16000000000},
  {title: 'Team', amount: 18000000000},
  {title: 'Marketing & Parthership', amount: 5000000000},
  {title: 'Public Pre-Sale', amount: 3000000000},
  {title: 'Token Liquidity', amount: 12000000000},
  {title: 'Rewards Program', amount: 6000000000},
  {title: 'DAO Treasury', amount: 14000000000},
  {title: 'Ecosystem Development Fund', amount: 6000000000},
];

const cruProject: Seed.Project = {
  projectId: '5eca85ab-4614-4a5d-ba1b-7102708d7217',

  name: cruAssetsPreprod.cru.longName || '',
  imageLogoUrl: cruAssetsPreprod.cru.iconUrl || '',

  // set project description
  shortDescription:
    'Our Smart Liquidity Management protocol is intuitive, hassle-free, and secure. Genius Yield minimizes risk and maximizes profits.',
  description:
    'While DeFi provides many investment opportunities, managing capital is both complex and time-consuming. Genius Yield is your all-in-one solution to benefit from advanced algorithmic trading stategies and yield optimixation opportunities.\n\nOur Smart Liquidity Management protocol is intuitive, hassle-free, and secure. Genius Yield minimizes risk and maximizes...',

  // set project media links
  mediaEmail: 'info@.cryptounicorns.fun',
  websiteUrl: 'https://www.cryptounicorns.fun',
  discordUrl: 'https://discord.gg/xSAAjcEWRU',
  mediaMediumUrl: 'https://medium.com/@lagunagames',
  twitterUrl: 'https://twitter.com/crypto_unicorns',
  whitePaperUrl:
    'https://whitepaper.cryptounicorns.fun/crypto-unicorns-whitepaper-v2',
  pitchDeckUrl: '',
  telegramUrl: '',
  mediaYoutubeUrl: 'https://www.youtube.com/@CryptoUnicorns',
  privacyPolicyUrl:
    'https://genius-x.gitbook.io/genius-x-whitepaper-v.-0.1/privacy-policy/privacy-policy-of-genius-x',

  // Token utility data
  tokenUtility: {
    description:
      'Crypto Unicorns is a new blockchain-based game centered around awesomely unique Unicorn NFTs which players can use in a fun farming simulation and in a variety of exciting battle loops.',
    items: [
      "20% off NFT's",
      "Dividens from fee's",
      'Access to premium content',
    ],
  },

  // set project key features
  keyFeature: [
    {
      title: 'Smart Swaps',
      description: 'Create limit dynamic and algorithmic orders.',
    },
    {
      title: 'Concentrated Liquidity',
      description: 'Eliminate impermanent loss, improve capital efficeny.',
    },
    {
      title: 'Smart Order Routers',
      description: 'Automate the scanning, matching and processing of orders.',
    },
    {
      title: 'Smart Liquidity Vault',
      description:
        'Yield optimization solution that algorithmically automates trading strategies.',
    },
  ],
  technology: [
    {
      iconUrl: '/cdn/technologies/cardano.png',
      title: 'Cardano',
      subtitle: 'proof-of-stake blockchain platform',
      description:
        'Cardano is a proof-of-stake blockchain platform: the first to be founded on peer-reviewed research and developed through evidence-based methods. It combines pioneering technologies to provide unparalleled security and sustainability to decentralized applications, systems, and societies.',
    },
    {
      iconUrl: '/cdn/technologies/eutxo.png',
      title: 'eUTxO',
      subtitle: 'Extended Unspent Transaction Output',
      description:
        'Extended UTXO (EUTXO), an extension to Bitcoin’s UTXO model that supports a substantially more expressive form of validation scripts, including scripts that implement general state machines and enforce invariants across entire transaction chains.',
    },
    {
      iconUrl: '/cdn/technologies/plutus.png',
      title: 'Plutus',
      subtitle: 'Programming language for Cardano smart contracts',
      description:
        'Haskell based programming language created by IOG in order to develop smart contracts on Cardano blockhain',
    },
  ],

  // set roadmap items
  roadmapItem: [
    {
      title: 'Q1',
      roadmapObjectives: ['finish design'],
      isChecked: true,
    },
    {
      title: 'Q2',
      roadmapObjectives: ['complete development'],
      isChecked: true,
    },
    {
      title: 'Q3',
      roadmapObjectives: ['Launch!!'],
      isChecked: false,
    },
  ],

  // set tokenomics pie chart info
  tokenomics: tokenomicsData,

  // set project report url
  projectReportUrl: 'https://docsend.com/view/v5gg3zbwy3fpmywn',

  assetId: cruAssetsPreprod.cru.assetId,
};

export const project = cruProject;
