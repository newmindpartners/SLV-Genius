import { Grid, styled, Typography } from '@mui/material';
import { FC, ReactElement, ReactNode } from 'react';
import Button from '~/components/Button/Button';
import ConnectWalletButtonDialog from '~/components/ConnectWalletButtonDialog';
import { InfoIcon } from '~/components/Icons';
import Tooltip from '~/components/Tooltip';
import { useWallet } from '~/hooks/wallet/wallet';
import useSwapOrderCard from '~/pages/Swap/components/OrderCard/hooks/order-card';

import OrderCardSkeleton from '../../OrderCardSkeleton';
import OrderFees from '../../OrderFees/OrderFees';
import OrderCardContent from './OrderCardContent';

type OrderCardProps = {
  isLoading: boolean;
  marketPriceFormatted: string | null;
  handleOrderBookClick: () => void;
};

const OrderCard: FC<OrderCardProps> = ({
  isLoading,
  marketPriceFormatted,
  handleOrderBookClick,
}): ReactElement => {
  const {
    orderType,
    setOrderType,
    fee: { isVisible: isVisibleFee, isLoading: isLoadingFee, data: dataFee },
    fields,
    isSubmitOrderDisabled,
    handleSubmitOrder,
    handleSetTradingPairAmounts,
    switchTradingPairs,
  } = useSwapOrderCard();

  return (
    <OrderWrapper>
      {isLoading ? (
        <OrderCardSkeleton />
      ) : (
        <form onSubmit={handleSubmitOrder} autoComplete="off">
          <Grid>
            <OrderHeading />
            <OrderCardContent
              {...fields}
              switchTradingPairs={switchTradingPairs}
              marketPriceFormatted={marketPriceFormatted}
              handleOrderBookClick={handleOrderBookClick}
              orderType={orderType}
              setOrderType={setOrderType}
              handleSetTradingPairAmounts={handleSetTradingPairAmounts}
            />
            <ActionBlock>
              {isVisibleFee && <OrderFees isLoadingFee={isLoadingFee} fee={dataFee} />}
              <PlaceOrderButton disabled={isSubmitOrderDisabled}>
                Place Order
              </PlaceOrderButton>
            </ActionBlock>
          </Grid>
        </form>
      )}
    </OrderWrapper>
  );
};

const OrderHeading = () => (
  <HeadingWrapper>
    <Title>Place an Order</Title>
    <Tooltip
      disableInteractive
      title={
        `Select two tokens that you'd like to trade and enter the amount.\n` +
        `“From” - tokens that you'd like to sell.\n` +
        `“To” - tokens that you'd like to buy.\n` +
        `Confirm the trade by clicking the “Place Order” button.`
      }
    >
      <Info>
        <div>How it works</div>
        <InfoIcon />
      </Info>
    </Tooltip>
  </HeadingWrapper>
);

export const PlaceOrderButton = ({
  children,
  disabled,
}: {
  children: ReactNode;
  disabled: boolean;
}) => {
  const { isWalletConnected } = useWallet();
  return (
    <ButtonWrapper>
      {isWalletConnected ? (
        <Button type="submit" disabled={disabled}>
          <Typography variant="body3" color="bgPrimaryGradient.contrastText">
            {children}
          </Typography>
        </Button>
      ) : (
        <ConnectWalletButtonDialog />
      )}
    </ButtonWrapper>
  );
};

const ButtonWrapper = styled(Grid)({
  button: {
    width: '100%',
    marginTop: '15px',
  },
});

export const ActionBlock = styled(Grid)(({ theme }) => ({
  padding: '0px 28px 28px',

  [theme.breakpoints.down('sm')]: {
    padding: '0px 20px 40px',
  },

  '.MuiButton-root:disabled': {
    backgroundColor: '#28304E',

    padding: '16px',
    cursor: 'not-allowed',
    pointerEvents: 'all',

    span: {
      color: '#414A70',
    },

    '&:hover': {
      boxShadow: 'unset',
      backgroundColor: '#28304E',
    },
  },
}));

const OrderWrapper = styled(Grid)(({ theme }) => ({
  width: '415px',
  maxWidth: '100%',
  fontFamily: 'Mulish',

  '& > form > div': {
    padding: '0',
    borderRadius: '15px',
    overflow: 'hidden',
    backgroundColor: '#202740',
    boxShadow: 'none',
  },

  [theme.breakpoints.down('sm')]: {
    width: '100%',
  },
}));

const Title = styled(Typography)(({ theme }) => ({
  fontStyle: 'normal',
  fontWeight: 800,
  fontSize: '20px',
  lineHeight: '24px',
  display: 'flex',
  alignItems: 'flex-end',
  color: '#FFFFFF',
  [theme.breakpoints.down('sm')]: {
    fontSize: '16px',
    lineHeight: '24px',
  },
}));

const HeadingWrapper = styled(Grid)(({ theme }) => ({
  padding: '20px 28px',
  display: 'flex',
  justifyContent: 'space-between',
  borderBottom: '1px solid #323F62',
  [theme.breakpoints.down('sm')]: {
    padding: '20px',
  },
}));

const Info = styled(Grid)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  columnGap: '8px',
  fontWeight: '500',
  fontSize: '12px',
  lineHeight: '16px',
  color: theme.palette.grey[100],

  [theme.breakpoints.down('sm')]: {
    fontSize: '12px',
    lineHeight: '16px',
  },
}));

export default OrderCard;
