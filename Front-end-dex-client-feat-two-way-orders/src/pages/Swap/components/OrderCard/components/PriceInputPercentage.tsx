import { Button, Grid, styled, Typography } from '@mui/material';
import { map } from 'lodash';
import { FC, ReactElement } from 'react';
import { useTradingPairs } from '~/context/tradingPairsContext';

type PriceInputPercentageProps = {
  marketPrice: string;
  adjustPriceByPercentage: (
    marketPrice: string,
    percentageValue: number,
    isFromBaseAsset: boolean,
  ) => void;
};

const PERCENT_BLOCKS = [
  {
    label: '5%',
    value: 0.05,
  },
  {
    label: '10%',
    value: 0.1,
  },
  {
    label: '25%',
    value: 0.25,
  },
];

const PriceInputPercentage: FC<PriceInputPercentageProps> = ({
  marketPrice,
  adjustPriceByPercentage,
}): ReactElement => {
  const { selectedTradingPair, selectedAssets } = useTradingPairs();

  const isFromBaseAsset =
    selectedAssets?.from?.assetId === selectedTradingPair?.baseAsset.assetId;

  const handlePercentClick = (value: number) =>
    adjustPriceByPercentage(marketPrice, value, isFromBaseAsset);

  const marketPositionLabel = isFromBaseAsset ? 'Above' : 'Below';

  return (
    <Grid
      container
      gap="7px"
      mt="8px"
      flexWrap="nowrap"
      justifyContent="space-between"
      alignItems="center"
    >
      <Grid container>
        <Typography variant="poweredBy" lineHeight="16px" color="textColor.light">
          {marketPositionLabel} market price:
        </Typography>
      </Grid>

      <Grid container flexWrap="nowrap" justifyContent="flex-end" gap="5px">
        {map(PERCENT_BLOCKS, ({ label, value }) => (
          <PercentItem
            key={label}
            onClick={() => handlePercentClick(value)}
            disableRipple
          >
            <Typography variant="poweredBy" lineHeight="16px" color="textColor.light">
              {label}
            </Typography>
          </PercentItem>
        ))}
      </Grid>
    </Grid>
  );
};

const PercentItem = styled(Button)(({ theme }) => ({
  cursor: 'pointer',
  backgroundColor: 'transparent',
  padding: '2px 5px',
  borderRadius: '6px',
  width: 'fit-content',
  minWidth: 'fit-content',
  border: '1px solid #2D3758',

  '&:hover': {
    background: '#4C54F5',
    boxShadow: 'none',

    '& .MuiTypography-root': {
      color: theme.palette.textColor.light,
    },
  },
}));

export default PriceInputPercentage;
