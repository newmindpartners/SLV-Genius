import * as Seed from '~/seed/types';
import {assets as ninjazAssetsMainnet} from '../asset';
import {teamMembers} from './teamMembers';

const tokenomicsData = [
  {title: 'Public Sale', amount: 250000000000000},
  {title: 'Founders', amount: 400000000000000},
  {title: 'Advisors & Partnerships', amount: 250000000000000},
  {title: 'Team', amount: 350000000000000},
  {title: 'Game Ecosystem', amount: 2750000000000000},
  {title: 'Stake Pool', amount: 250000000000000},
  {title: 'NFT Holder Airdrop', amount: 250000000000000},
  {title: 'Liquidity Tokens', amount: 500000000000000},
];

const ninjazProject: Seed.Project = {
  projectId: '66c2169c-1436-4a65-94b0-a7c063b95389',

  name: ninjazAssetsMainnet.ninjaz.longName || '',
  imageLogoUrl: ninjazAssetsMainnet.ninjaz.iconUrl || '',

  // set project description
  shortDescription:
    'Danketsu (Formerly known as ADA NinjaZ) is a Web3 media and entertainment business featuring NFTs, literature (manga-comics, screenplays, light novels, books), music, and gamified staking, with existing intellectual properties of value, and an established community.',
  description:
    'Danketsu (Formerly known as ADA NinjaZ) is a Web3 media and entertainment business featuring NFTs, literature (manga-comics, screenplays, light novels, books), music, and gamified staking, with existing intellectual properties of value, and an established community.  Its latest game project is designed to solve the various problems in today’s gaming industry, including lack of proof of concept; lack of quality or true gaming experience; too much focus on token economy (or the “earn” rather than the “play” part); and not developed by gaming professionals. ' +
    '\n' +
    'Danketsu’s products are based on intellectual properties (IPs) co-developed by the team and its community.  Over the last year, Danketsu has successfully proven the value of their IPs through the launch of various non-fungible token (NFT)-based media products, including the four collections of Danketsu digital art, the two series of manga-comics (including a physical NFT-linked copy), one light novel, and an animation episode screenplay.  The team, with input from the Danketsu community, have also co-produced four songs.  Based on the community’s interest, Danketsu is now in the process of developing an NFT web-based gamified staking platform called Danketsu Missions.  Danketsu Missions will be live and available to play upon the $NINJAZ token generation event in March 2023.' +
    '\n' +
    'Danketsu has an established community that have been highly engaged with the team and each other, in contributing to the future stories of the “Danketsu” IPs.  This community-building success has been proven for the digital art collections, the manga comic series, and the music products that Danketsu has launched.  As of 25/01/2023, Danketsu has ~20,000 Twitter followers; ~12,000 Discord members; ~4,700 holders of their digital art collection NFTs; and has achieved more than 1.7 million ADA total trading volume of its NFT collections on jpg.store.',

  // set project media links
  websiteUrl: 'https://danketsu.io/',
  discordUrl: 'https://discord.gg/danketsu',
  twitterUrl: 'https://twitter.com/danketsuNFT',
  whitePaperUrl: 'https://ada-ninjaz.gitbook.io/dank-paper-3.0/',
  privacyPolicyUrl:
    'https://genius-x.gitbook.io/genius-x-whitepaper-v.-0.1/privacy-policy/privacy-policy-of-genius-x',

  // Token utility data
  tokenUtility: {
    description:
      '$NINJAZ is the utility and governance token for the Danketsu ecosystem, which will be 100% minted on the Cardano blockchain. There will be a total supply of 5 billion tokens.  The token utilities include the following:',
    items: [
      'Upgrade the art of your Danketsu NFTs.',
      'Interact and play the Danketsu Missions platform.',
      'Participate in partner project NFT launches.',
      'Participate in raffles for other NFTs.',
      'Playing Danketsu Missions (buy Mission items, free locked NFTs, unlock new features).',
      'Vote on future business operations.',
      'Vote on key Danketsu story elements.',
      'Purchase limited edition Danketsu branded merchandise.',
    ],
  },

  // set project key features
  keyFeature: [
    {
      title: 'Digital Art Collections ',
      description:
        'Profile Picture styled NFTs in various seasons - Aramar Clan (Season 1); Atsuko Clan (Season 2); Daisuke Clan (Season 3); The Fourth (Season 4). These NFT collections are the entry into the Danketsu ecosystem of utilities. ',
    },
    {
      title: 'Literature',
      description:
        'The Blacksmith Origin; Aramar: Origins - Volume 1; Atsuko: Origins - Volume 1; Adan: Eye of Our Storm - Screenplay; Fandom Wiki. Written by the Storyteller, story voted upon and influenced by the community.',
    },
    {
      title: 'Music',
      description:
        'Community-driven music creation processes using blockchain technology and by partnering with artists and musicians; music products including 4 tracks with small NFT collections and 450,000+ streams across Spotify and Apple Music.',
    },
    {
      title: 'Gamified Staking Missions Platform',
      description:
        'Lore-based NFT Staking mechanism known as Danketsu Missions.',
    },
  ],

  // set roadmap items
  roadmapItem: [
    {
      title: 'Q1 2023',
      roadmapObjectives: [
        '$NINJAZ token public sale / Token Generation Event (TGE)',
        'Token staking and NFT staking',
        'Gamified Staking Platform - Phase 1 release (missions series and basic rarity-based missions)',
        'Daisuke music single release and music NFT sale (NEWM)',
      ],
      isChecked: false,
    },
    {
      title: 'Q2 2023',
      roadmapObjectives: [
        'Development of music and lore',
        'Gamified Staking Platform - Phase 2 release (expansion of gamified staking, achievements and full traits-based missions)',
        'The Fourth NFT collection art upgrade',
      ],
      isChecked: false,
    },
    {
      title: 'Q3 2023',
      roadmapObjectives: [
        'Gamified Staking Platform - Phase 3 release (NFT partner integration)',
        'The Cataclysm (NFT event).',
      ],
      isChecked: false,
    },
    {
      title: 'Q4 2023',
      roadmapObjectives: [
        'Evolution of Gamified Staking Platform into full text-based adventure game - Phase 4',
      ],
      isChecked: false,
    },
  ],

  // set tokenomics pie chart info
  tokenomics: tokenomicsData,

  // set project report url
  projectReportUrl: 'https://docsend.com/view/v5gg3zbwy3fpmywn',

  assetId: ninjazAssetsMainnet.ninjaz.assetId,

  teamMember: teamMembers,
};

export const project = ninjazProject;
