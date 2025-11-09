import { Avatar, Grid, styled, Typography } from '@mui/material';
import { FC } from 'react';
import Tooltip from '~/components/Tooltip';
import { useTradingPairs } from '~/context/tradingPairsContext';
import { div } from '~/utils/mathUtils';
import { formatMarketPrice, TradingPairAssets } from '~/utils/tradingPairsUtils';

import SwitchButton from '../OrderCard/components/SwitchButton';

type MarketDataIconProps = {
  iconUrl: string | undefined;
  shortName: string | undefined;
};

const MarketDataIcon = ({ iconUrl, shortName }: MarketDataIconProps) =>
  iconUrl ? <IconWrapper src={iconUrl} alt={shortName} /> : null;

type HeaderProps = {
  marketPrice: string | undefined;
  marketDataAssets: TradingPairAssets;
  handleSetMarketDataPairAssets: (newMarketDataPair: TradingPairAssets) => void;
};

const Header: FC<HeaderProps> = ({
  marketDataAssets,
  marketPrice,
  handleSetMarketDataPairAssets,
}) => {
  const { selectedTradingPair } = useTradingPairs();

  const isPriceFlipped =
    marketDataAssets.to?.assetId !== selectedTradingPair?.quoteAsset.assetId;

  const quotePrice = marketPrice || null;
  const flippedPrice = marketPrice ? div(1, marketPrice) : null;

  const price = isPriceFlipped ? flippedPrice : quotePrice;
  const priceAsset = isPriceFlipped
    ? selectedTradingPair?.baseAsset
    : selectedTradingPair?.quoteAsset;

  const detailedPrice = price ? formatMarketPrice(price).detailed : '-';
  const roundedPrice = price ? formatMarketPrice(price).rounded : '-';

  const marketPriceDetailed = `${detailedPrice} ${priceAsset?.shortName}`;
  const marketPriceRounded = `${roundedPrice} ${priceAsset?.shortName}`;

  const handleSwitchTradingPairs = () => {
    handleSetMarketDataPairAssets({
      from: marketDataAssets.to,
      to: marketDataAssets.from,
    });
  };

  const tradingPairSymbol = `${selectedTradingPair?.baseAsset?.shortName} / ${selectedTradingPair?.quoteAsset?.shortName}`;

  if (!marketDataAssets.from || !marketDataAssets.to || !marketPrice) return null;

  return (
    <Grid display="flex" flexDirection="row" gap="15px">
      <Grid display="flex" alignItems="center" width="fit-content" gap="10px">
        <RoundIconsWrapper display="flex" minWidth="100px" width="fit-container">
          <MarketDataIcon
            iconUrl={selectedTradingPair?.baseAsset?.iconUrl}
            shortName={selectedTradingPair?.baseAsset?.shortName}
          />

          <MarketDataIcon
            iconUrl={selectedTradingPair?.quoteAsset?.iconUrl}
            shortName={selectedTradingPair?.quoteAsset?.shortName}
          />
        </RoundIconsWrapper>

        <Grid display="flex" flexDirection="column" item width="fit-content" gap="5px">
          <Typography
            variant="statusCard"
            color="buttonsInactive.dark"
            fontSize="13px"
            fontWeight="500"
            lineHeight="16px"
            alignSelf="flex-start"
          >
            {tradingPairSymbol}
          </Typography>

          <Tooltip title={marketPriceDetailed} placement="top">
            <TitleTypography
              variant="h3"
              fontSize="29px"
              fontWeight="700"
              lineHeight="36px"
              height="36px"
              textAlign="left"
            >
              {marketPriceRounded}
            </TitleTypography>
          </Tooltip>
        </Grid>
      </Grid>

      <SwitchButtonWrapper>
        <SwitchButton onClick={handleSwitchTradingPairs} />
      </SwitchButtonWrapper>
    </Grid>
  );
};

const RoundIconsWrapper = styled(Grid)(() => ({
  '& > .MuiAvatar-circular:last-of-type': {
    marginLeft: '-10px',
  },
}));

export const IconWrapper = styled(Avatar)(({ theme }) => ({
  width: '50px',
  height: '50px',
  margin: '0',
  backgroundColor: theme.palette.bgCardGray.main,
  boxShadow: `0 0 0 3px ${theme.palette.bgCardRoundColor.main}`,

  '& > img': {
    width: '50px',
    height: '50px',
  },
}));

const SwitchButtonWrapper = styled(Grid)({
  transform: 'rotate(90deg)',
});

const TitleTypography = styled(Typography)(({ theme }) => ({
  textWrap: 'nowrap',
  [theme.breakpoints.down('sm')]: {
    fontSize: '19px',
    lineHeight: '20px',
  },
}));

export default Header;
