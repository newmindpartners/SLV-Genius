import { GitHub, Instagram, X, YouTube } from '@mui/icons-material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { MenuItem as MUIMenuItem } from '@mui/material';
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import { Link } from 'react-router-dom';
import IconButton from '~/components/Button/IconButton';
import ConnectWalletButtonDialog from '~/components/ConnectWalletButtonDialog';
import { Discord, Medium, Telegram } from '~/components/Icons/Icons';

export const ROUTES = {
  HOME: '/home',
  SWAP: '/swap',
  POOL: '/pool',
  EARN: '/earn',
  EARN_UTILITY_NFT_CHECKER: '/earn/:assetId',
  BOT_DETAILS: '/bot/:botId',
  EXPLORE: '/explore',
  EXPLORE__MY_ORDERS: '/explore/my-orders',
  EXPLORE__LIQUIDITY_POSITIONS: '/explore/liquidity-positions',
  EXPLORE__DEX_ORDERS: '/explore/dex-orders',
  LEADERBOARD: '/leaderboard',
  RELEASE_NOTES: '/release-notes',
  PAGE_404: '/404',
  OPTIONS: '/options',
  SMART_VAULTS: '/smart-vaults',
  SMART_VAULT_DETAILS: '/smart-vaults/:smartVaultId',
  SLV: '/slv',
  SLV_ORDER_DETAILS: '/slv/order/:orderId',
} as const;

const MenuItem = styled(MUIMenuItem)({
  a: {
    textDecoration: 'underline',
  },
});

const IconWrapper = styled('div')(() => ({
  '& svg': {
    transform: 'rotate(-45deg)',
  },
}));

export const links = [
  <Link key="2" to={ROUTES.SWAP}>
    <MenuItem>
      <Typography variant="subtitle1">Swap</Typography>
    </MenuItem>
  </Link>,
  <Link key="4" to={ROUTES.EARN}>
    <MenuItem>
      <Typography variant="subtitle1">Earn</Typography>
    </MenuItem>
  </Link>,
  <Link key="5" to={ROUTES.EXPLORE}>
    <MenuItem>
      <Typography variant="subtitle1">Explore</Typography>
    </MenuItem>
  </Link>,
  <Link key="6" to={ROUTES.LEADERBOARD}>
    <MenuItem>
      <Typography variant="subtitle1">Leaderboard</Typography>
    </MenuItem>
  </Link>,
  <Link key="7" to={ROUTES.SLV}>
    <MenuItem>
      <Typography variant="subtitle1">SLV</Typography>
    </MenuItem>
  </Link>,
];

export const actions = [
  <ConnectWalletButtonDialog id="gy-header-connect-wallet-button" key="0" />,
];

// Footer data
export const socials = [
  <a
    key="a-icon"
    target="_blank"
    rel="noreferrer"
    href="https://t.me/geniusyield_official"
  >
    <IconButton size={'medium'} color={'secondary'}>
      <Telegram />
    </IconButton>
  </a>,
  <a key="b-icon" target="_blank" rel="noreferrer" href="https://discord.gg/TNHf4fs626">
    <IconButton size={'medium'} color={'secondary'}>
      <Discord />
    </IconButton>
  </a>,
  <a key="c-icon" target="_blank" rel="noreferrer" href="https://geniusyield.medium.com/">
    <IconButton size={'medium'} color={'secondary'}>
      <Medium />
    </IconButton>
  </a>,
  <a
    key="d-icon"
    target="_blank"
    rel="noreferrer"
    href="https://twitter.com/GeniusyieldO"
  >
    <IconButton size={'medium'} color={'secondary'}>
      <YouTube />
    </IconButton>
  </a>,
  <a
    key="e-icon"
    target="_blank"
    rel="noreferrer"
    href="https://twitter.com/GeniusyieldO"
  >
    <IconButton size={'medium'} color={'secondary'}>
      <GitHub />
    </IconButton>
  </a>,
  <a
    key="f-icon"
    target="_blank"
    rel="noreferrer"
    href="https://twitter.com/GeniusyieldO"
  >
    <IconButton size={'medium'} color={'secondary'}>
      <Instagram />
    </IconButton>
  </a>,
  <a
    key="g-icon"
    target="_blank"
    rel="noreferrer"
    href="https://twitter.com/GeniusyieldO"
  >
    <IconButton size={'medium'} color={'secondary'}>
      <X />
    </IconButton>
  </a>,
];

export const redirects = [
  <a
    key="footer-project"
    target="_blank"
    rel="noreferrer"
    href="https://www.geniusyield.co/"
  >
    <Typography variant="body3">Genius Yield</Typography>
    <IconWrapper>
      <ArrowForwardIcon />
    </IconWrapper>
  </a>,
  <a
    key="footer-portfolion"
    target="_blank"
    rel="noreferrer"
    href="https://academy.geniusyield.co/"
  >
    <Typography variant="body3">Genius Academy</Typography>
    <IconWrapper>
      <ArrowForwardIcon />
    </IconWrapper>
  </a>,
];

export const footerQuickLinks = [
  <a
    key="footer-projects"
    target="_blank"
    rel="noreferrer"
    href="https://www.geniusyield.co/marketmakerbot?lng=en"
  >
    <Typography variant="body3">Market Maker Bots</Typography>
  </a>,
  <a
    key="footer-sorder"
    target="_blank"
    rel="noreferrer"
    href="https://www.geniusyield.co/smartorderrouter?lng=en"
  >
    <Typography variant="body3">Smart Order Router</Typography>
  </a>,
  <a
    key="footer-dao"
    target="_blank"
    rel="noreferrer"
    href="https://voice.geniusyield.co/"
  >
    <Typography variant="body3">DAO</Typography>
  </a>,
  <a
    key="footer-docs"
    target="_blank"
    rel="noreferrer"
    href="https://docs.geniusyield.co/"
  >
    <Typography variant="body3">Docs</Typography>
  </a>,
  <a
    key="footer-whitepaper"
    target="_blank"
    rel="noreferrer"
    href="https://www.geniusyield.co/whitepaper.pdf?lng=en-GB"
  >
    <Typography variant="body3">Whitepaper</Typography>
  </a>,
  <a
    key="footer-disclosure"
    target="_blank"
    rel="noreferrer"
    href="https://docs.geniusyield.co/security/vulnerability-disclosure"
  >
    <Typography variant="body3">Vulnerability Disclosure</Typography>
  </a>,
];

export const footerLegalLinks = [
  <a
    key="footer-projects"
    target="_blank"
    rel="noreferrer"
    href="https://docs.geniusyield.co/terms-of-services/staking-platform-terms-and-conditions"
  >
    <Typography variant="body3">Terms & Conditions</Typography>
  </a>,
  <a
    key="footer-projects"
    target="_blank"
    rel="noreferrer"
    href="https://docs.geniusyield.co/privacy-policy/privacy-and-cookies-policy"
  >
    <Typography variant="body3">Privacy Policy</Typography>
  </a>,
  <a
    key="footer-projects"
    target="_blank"
    rel="noreferrer"
    href="https://docs.geniusyield.co/legal-disclaimer/disclaimer"
  >
    <Typography variant="body3">Legal Disclaimer</Typography>
  </a>,
];
