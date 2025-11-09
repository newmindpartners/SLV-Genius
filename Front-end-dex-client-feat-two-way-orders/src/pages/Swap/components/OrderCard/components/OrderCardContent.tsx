import { Grid, styled, Tab, Tabs, Typography } from '@mui/material';
import { FC, SyntheticEvent, useCallback } from 'react';
import {
  OrderCardOrderType,
  useAdvancedSettings,
} from '~/context/advancedSettingsContext';
import { useAdvancedSettingsDialog } from '~/context/advancedSettingsDialog';
import { useTradingPairs } from '~/context/tradingPairsContext';
import OrderBookButton from '~/pages/Swap/components/MarketData/OrderBookButton';
import OrderCardMarketTabs from '~/pages/Swap/components/OrderCard/components/OrderCardMarketTabs';
import TextFieldIconSelect from '~/pages/Swap/components/OrderCard/components/TextFieldIconSelect/TextFieldIconSelect';
import { OrderCardFields } from '~/pages/Swap/components/OrderCard/hooks/order-card';
import useSwapOrderFields from '~/pages/Swap/components/OrderCard/hooks/order-card/useSwapOrderFields';
import { isGreater, minus } from '~/utils/mathUtils';
import {
  getTradingPairPrice,
  TradingAsset,
  TradingPairAmounts,
} from '~/utils/tradingPairsUtils';

import AdvancedSettingsSection from './AdvancedSettingsSection';
import AlternativeOrderSection from './AlternativeOrderSection';
import AvailableInputPercentage from './AvailableInputPercentage';
import OrderCardPrice from './OrderCardPrice';
import OrderCardPriceWarning from './OrderCardPriceWarning';
import PriceInputPercentage from './PriceInputPercentage';
import SwitchButton from './SwitchButton';

type OrderCardContentProps = OrderCardFields & {
  switchTradingPairs: (
    fromAmount: string,
    toAmount: string,
    from: TradingAsset | null,
    to: TradingAsset | null,
  ) => void;
  orderType: OrderCardOrderType;
  marketPriceFormatted: string | null;
  setOrderType: (orderType: OrderCardOrderType) => void;
  handleOrderBookClick: () => void;
  handleSetTradingPairAmounts: (tradingPairAmounts: TradingPairAmounts) => void;
};

export type TokenTabsType = 'Token' | 'Options';

const OrderCardContent: FC<OrderCardContentProps> = ({
  orderType,
  from,
  to,
  price,
  marketPriceFormatted,
  switchTradingPairs,
  setOrderType,
  handleOrderBookClick,
  handleSetTradingPairAmounts,
}) => {
  const { onDialogOpen: openAdvancedSettingsDialog } = useAdvancedSettingsDialog();

  const { advancedSettings } = useAdvancedSettings();

  const {
    tradingAssets,
    selectedTradingPair,
    selectedAssets,
    handleSetTradingPairAssets,
  } = useTradingPairs();

  const {
    toField,
    fromField,
    priceField,
    handleSwitchTradingPairs,
    onChangeFromAmount,
    adjustPriceByPercentage,
  } = useSwapOrderFields({
    orderType,
    tradingAssets,
    selectedAssets,
    from,
    to,
    price,
    switchTradingPairs,
    handleSetTradingPairAmounts,
    handleSetTradingPairAssets,
    marketPriceFormatted,
  });

  const displayedMarketPrice = marketPriceFormatted;

  const handleMarketTabChange = (
    _event: SyntheticEvent,
    newValue: OrderCardOrderType,
  ) => {
    setOrderType(newValue);
  };

  const handleOpenAdvancedSettings = () => {
    openAdvancedSettingsDialog();
  };

  const handleSelectAlternativePrice = useCallback(
    (alternativeValue: string) => {
      from.onChange(alternativeValue);
    },
    [from],
  );

  const isOrderBookButtonDisabled = !selectedAssets.from || !selectedAssets.to;

  /**
   * Due to issues related to 0 decimal assets and the below market price
   * functionality, we are disabling the feature for such assets.
   * See https://github.com/geniusyield/dex-client/pull/1269
   */
  const isDecimalPrecisionPositive =
    typeof selectedAssets.to?.decimalPrecision === 'number' &&
    isGreater(selectedAssets.to?.decimalPrecision, 0) &&
    typeof selectedAssets.from?.decimalPrecision === 'number' &&
    isGreater(selectedAssets.from?.decimalPrecision, 0);

  const betterAlternativeOrder =
    from.alternativeValue &&
    to.alternativeValue &&
    selectedAssets.to &&
    isGreater(to.alternativeValue, to.value || '0')
      ? {
          fromValue: from.alternativeValue,
          toShortName: selectedAssets.to?.shortName,
          ...(to.value
            ? {
                variant: 'BETTER_THAN_CURRENT' as const,
                toValueDiscount: minus(to.alternativeValue, to.value),
              }
            : {
                variant: 'NO_CURRENT_EXIST' as const,
              }),
        }
      : null;

  const orderPrice = getTradingPairPrice(
    selectedAssets.from,
    selectedAssets.to,

    from.value,
    to.value,

    selectedTradingPair,
  );

  return (
    <Wrapper container direction="column">
      <OrderCardSubHeading
        container
        alignItems="center"
        mb="16px"
        minWidth="100%"
        gap="8px"
      >
        <Typography
          fontSize="12px"
          fontWeight="600"
          lineHeight="16px"
          letterSpacing="0.6px"
        >
          Trading:
        </Typography>

        <StyledTabs value="token">
          <StyledTab value="token" label={'Token'} />
        </StyledTabs>

        <OrderBookButton
          handleOrderBookClick={handleOrderBookClick}
          isOrderBookDisabled={isOrderBookButtonDisabled}
        />
      </OrderCardSubHeading>

      <OrderCardMarketTabs value={orderType} onChange={handleMarketTabChange} />
      <Grid display="flex" container direction="column" gap="8px">
        <Grid position="relative" display="flex" flexDirection="column" gap="5px">
          <AvailableInputPercentageWrapper>
            <AvailableInputPercentage handleChangeAmount={onChangeFromAmount} />
          </AvailableInputPercentageWrapper>

          <TextFieldIconSelect {...fromField} />

          <SwitchButtonWrapper position="absolute" top="50%" left="50%">
            <SwitchButton onClick={handleSwitchTradingPairs} />
          </SwitchButtonWrapper>

          <TextFieldIconSelect {...toField} />
        </Grid>
      </Grid>

      <OrderCardPrice
        {...priceField}
        tradingPairAmounts={{
          from: from.value,
          to: to.value,
        }}
        selectedAssets={selectedAssets}
        orderType={orderType}
      />

      <OrderConfigurations>
        {displayedMarketPrice &&
          orderType === 'limit' &&
          isDecimalPrecisionPositive &&
          selectedAssets.from && (
            <PriceInputPercentage
              marketPrice={displayedMarketPrice}
              adjustPriceByPercentage={adjustPriceByPercentage}
            />
          )}

        {displayedMarketPrice && orderPrice && (
          <OrderCardPriceWarning
            orderPrice={orderPrice}
            marketPrice={displayedMarketPrice}
          />
        )}

        {orderType === 'limit' && (
          <AdvancedSettingsSection
            handleOpenAdvancedSettings={handleOpenAdvancedSettings}
            advancedSettings={advancedSettings}
          />
        )}

        {orderType === 'bestAvailable' && betterAlternativeOrder && (
          <Grid>
            <AlternativeOrderSection
              betterAlternativeOrder={betterAlternativeOrder}
              onSelectAlternativePrice={handleSelectAlternativePrice}
            />
          </Grid>
        )}
      </OrderConfigurations>
      <Line />
    </Wrapper>
  );
};

const Wrapper = styled(Grid)(({ theme }) => ({
  padding: '12px 29px 20px',

  [theme.breakpoints.down('sm')]: {
    padding: '12px 20px 20px',
  },
}));

const StyledTabs = styled(Tabs)({
  minHeight: '0px',

  '& .MuiTabs-indicator': {
    height: '100%',
    background: '#4C54F5',
    borderRadius: '7px',
  },
});

const StyledTab = styled(Tab)(({ theme }) => ({
  '&.MuiTab-root': {
    textTransform: 'none',
    fontSize: '12px',
    fontWeight: '600',
    lineHeight: '16px',
    letterSpacing: '0.6px',
    color: theme.palette.buttonsInactive,
    padding: '6px 8px',
    minWidth: '0px',
    minHeight: '0px',
    borderRadius: '7px',
    position: 'relative',
    zIndex: '1',

    '&.Mui-disabled': {
      cursor: 'not-allowed',
      pointerEvents: 'all',
      opacity: 0.3,
    },
  },

  '&.Mui-selected': {
    color: theme.palette.textColor.main,
  },
}));

const OrderCardSubHeading = styled(Grid)(({ theme }) => ({
  [theme.breakpoints.down('sm')]: {
    h4: {
      fontSize: '14px',
      lineHeight: '20px',
      color: '#EAEBEE',
    },
  },
}));

const AvailableInputPercentageWrapper = styled(Grid)(() => ({
  position: 'absolute',
  top: '8px',
  right: '5px',
  zIndex: '1',
}));

const Line = styled(Grid)({
  marginTop: '28px',
  borderTop: '1px solid #323F62',
});

const SwitchButtonWrapper = styled(Grid)({
  transform: 'translate(-50%, -50%)',
  zIndex: 2,
});

const OrderConfigurations = styled(Grid)({
  minHeight: '60px',
});

export default OrderCardContent;
