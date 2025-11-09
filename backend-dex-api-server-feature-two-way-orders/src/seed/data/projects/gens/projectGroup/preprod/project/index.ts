import {assets as gensPreprodAssets} from '../asset';
import {teamMembers} from './teamMembers';
import * as Seed from '~/seed/types';

export const project: Seed.Project = {
  projectId: 'b32f8397-3392-40c3-8882-a940bc7ba5e9',
  name: gensPreprodAssets.gens.longName,
  imageLogoUrl: gensPreprodAssets.gens.iconUrl,

  // set project description
  shortDescription:
    'Genius Yield is the all-in-one DeFi platform, that combines concentrated liquidity DEX (“Genius DEX”) with an automated yield optimizer (“Smart Liquidity Vault”), built from the ground up to fully benefit from Cardano’s EUTxO-based ledger which would be accessible both to beginners and seasoned traders.',
  description:
    'While DeFi provides many investment opportunities, managing capital is both complex and time-consuming. Due to thousands of tokens and liquidity pools, even intermediate and experienced users might not utilize investment opportunities to the full extent. What is even more confusing, DEXs and yield optimizers usually function as separate products, which limits yield optimization opportunities and negatively impacts user experience' +
    '\n' +
    'Genius Yield is an answer to all of those concerns.' +
    '\n' +
    'Genius Yield is the all-in-one DeFi platform, that combines a concentrated liquidity DEX - Genius DEX - with an automated yield optimizer - Smart Liquidity Vault - built from the ground up to fully benefit from Cardano’s EUTxO-based ledger which would be accessible both to beginners and seasoned traders.' +
    '\n' +
    'Genius Yield minimizes risk and maximizes profits in an intuitive, hassle-free way.' +
    '\n' +
    'KEY FEATURES:' +
    '\n' +
    '- Smart Swaps — create a limit, dynamic and algorithmic orders using programmable swaps. Fully automate and adjust all trades to your personal needs.' +
    '\n' +
    '- Concentrated Liquidity — eliminate impermanent loss, improve capital efficiently and earn higher rewards. Safely increase the efficiency of your investments.' +
    '\n' +
    '- Smart Order Routers - automate the scanning, matching, and processing of orders. As a Smart Order Router operator, you can maximize your profits from bid-ask spreads.' +
    '\n' +
    '- Smart Liquidity Vault - yield optimization solution that algorithmically automates trading strategies to maximize your APY while minimizing risk exposure.  Even inexperienced users can easily and safely earn yield.' +
    '\n' +
    '- GENS Staking Program. Earn a portion of the platform revenue through staking rewards.' +
    '\n' +
    'GENS TOKEN UTILITIES (available through Genius Yield Staking Program):' +
    '\n' +
    '- redistribution of 20% of DEX &  Smart Vault protocol fees' +
    '\n' +
    '- DAO governance rights on the future development of Genius Yield',

  // set project media links

  websiteUrl: 'https://geniusyield.co/',
  discordUrl: 'https://discord.gg/hXpnk2wUyp',
  mediaEmail: 'support@genius-x.co',
  mediaMediumUrl: 'https://geniusyield.medium.com/',
  twitterUrl: 'https://twitter.com/GeniusyieldO',
  whitePaperUrl: 'https://www.geniusyield.co/whitepaper.pdf?lng=en-GB',
  pitchDeckUrl: '',
  telegramUrl: '',

  assetId: gensPreprodAssets.gens.assetId,

  teamMember: teamMembers,
};
