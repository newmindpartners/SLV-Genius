import { Grid, Collapse as MuiCollapse, styled } from '@mui/material';
import { useCallback, useEffect, useState } from 'react';
import EnhancedTableContainer from '~/components/EnhancedTable';
import TableHeader from '~/components/EnhancedTable/TableHeader';
import TablePagination from '~/components/EnhancedTable/TablePagination';
import NotificationBanner from '~/components/NotificationBanner/NotificationBanner';
import { useSwapOrderBookDialog } from '~/context/orderBookDialog';
import { useTradingPairs } from '~/context/tradingPairsContext';
import useSwapListOrdersFormatting from '~/hooks/swap/list-orders/useSwapListOrdersFormatting';
import useSwapListOrdersSorted, {
  UseSwapListOrdersSortedConfig,
} from '~/hooks/swap/list-orders/useSwapListOrdersSorted';
import { useGetOrderBookByAssets } from '~/hooks/swap/order-book/useGetOrderBookByAssets';
import { useWallet } from '~/hooks/wallet/wallet';
import OrderBookCard from '~/pages/Swap/components/OrderBook/OrderBookCard';
import { SwapOrderStatus } from '~/redux/api';
import { LOCAL_STORAGE_KEYS } from '~/utils/constants';
import { checkIsMobile } from '~/utils/mobileUtils';
import { formatMarketPrice, getTradingPairString } from '~/utils/tradingPairsUtils';

import { tableHeadlines } from '../Explore/mocks';
import MarketData from './components/MarketData';
import OrderCard from './components/OrderCard/components';

const prohibitedCountriesBannerTitle = `The use of Genius Yield's DEX is restricted in the following countries:`;

const PROHIBITED_COUNTRIES = [
  'Afghanistan',
  'Albania',
  'Algeria',
  'Angola',
  'Azerbaijan',
  'Bahrain',
  'Bangladesh',
  'Belarus',
  'Benin',
  'Bolivia',
  'Bosnia',
  'Botswana',
  'Burkina Faso',
  'Haiti',
  'Iran',
  'Jordan',
  'Mali',
  'Morocco',
  'Myanmar',
  'Nicaragua',
  'Pakistan',
  'Republic of Korea (North)',
  'Russia',
  'Senegal',
  'Sudan',
  'Syria',
  'Uganda',
  'Yemen',
];

export const DEFAULT_POLLING_INTERVAL = 5000;
export const ORDER_BOOK_COLLAPSED_POLLING_INTERVAL = 30000;

const SwapPageContent = () => {
  const [expandedRowId, setExpandedRowId] = useState<number | string | null>(null);
  const { isLoadingTradingAssets, selectedAssets, selectedTradingPair } =
    useTradingPairs();
  const { onDialogOpen: openOrderBookDialog } = useSwapOrderBookDialog();

  const [isBannerVisible, setIsBannerVisible] = useState(false);
  const [orderStatus, setOrderStatus] = useState<SwapOrderStatus | null>(null);
  const [isOrderBookExpanded, setIsOrderBookExpanded] = useState(false);

  const handleToggleOrderBook = () => {
    const isMobile = checkIsMobile();
    if (isMobile) {
      openOrderBookDialog();
    } else {
      setIsOrderBookExpanded(!isOrderBookExpanded);
    }
  };
  const handleCloseOrderBook = () => setIsOrderBookExpanded(false);

  const { isWalletConnected, walletStakeKeyHash } = useWallet();

  const tradingPairString = selectedTradingPair
    ? getTradingPairString(selectedTradingPair)
    : null;

  const orderBook = useGetOrderBookByAssets({
    pollingInterval: isOrderBookExpanded
      ? DEFAULT_POLLING_INTERVAL
      : ORDER_BOOK_COLLAPSED_POLLING_INTERVAL,
    skip: !selectedTradingPair,
    tradingPairString: tradingPairString || '',
  });

  const orderFilterCriteria = {
    filterByWalletStakeKeyHash: walletStakeKeyHash,
    ...(orderStatus ? { filterByOrderSwapStatus: orderStatus } : {}),
  };

  const hookConfigOptions: UseSwapListOrdersSortedConfig = {
    skip: !isWalletConnected,
    pollingInterval: DEFAULT_POLLING_INTERVAL,
  };

  const {
    data: {
      data: ordersData,
      isLoading: isLoadingOrders,
      isFetching: isFetchingOrders,
      isLoadingWithArgsUpdated,
    },
    pagination,
    sortState,
    handleSortChange,
    resetPagination,
  } = useSwapListOrdersSorted(orderFilterCriteria, hookConfigOptions);

  const handleTableContainerSortChange = useCallback(
    (content: string) => {
      resetPagination();
      handleSortChange(content);
    },
    [handleSortChange, resetPagination],
  );

  const isLoadingCardData = isLoadingTradingAssets;
  const isLoadingTableData = isLoadingOrders;

  const ordersRows = useSwapListOrdersFormatting({
    orders: ordersData?.results || [],
    ordersTableExpandedRowId: expandedRowId,
    isMyOrders: true,
  });

  const handleOrderStatusChange = (newStatus: SwapOrderStatus | null) => {
    setOrderStatus(newStatus);
    resetPagination();
  };

  useEffect(() => {
    if (!selectedAssets.from || !selectedAssets.to) {
      handleCloseOrderBook();
    }
  }, [selectedAssets.from, selectedAssets.to]);

  useEffect(() => {
    const bannerDismissed =
      localStorage.getItem(LOCAL_STORAGE_KEYS.RESTRICTED_USER_BANNER_DISMISSED) ===
      'true';
    setIsBannerVisible(!bannerDismissed);
  }, []);

  const handleBannerClose = () => {
    setIsBannerVisible(false);
    localStorage.setItem(LOCAL_STORAGE_KEYS.RESTRICTED_USER_BANNER_DISMISSED, 'true');
  };

  const orderBookAssets = {
    amountAsset: selectedTradingPair?.baseAsset || null,
    priceAsset: selectedTradingPair?.quoteAsset || null,
  };

  const marketPriceFormatted =
    orderBook.data && selectedAssets.from && selectedAssets.to
      ? formatMarketPrice(orderBook.data.marketPrice).detailed
      : null;

  return (
    <Grid>
      <Collapse in={isBannerVisible} collapsedSize={0} timeout={800}>
        <NotificationBanner
          title={prohibitedCountriesBannerTitle}
          text={PROHIBITED_COUNTRIES.join(', ')}
          onClose={handleBannerClose}
          hasHighlights={true}
        />
      </Collapse>

      <ContentWrapper container gap="20px" alignItems="start" wrap="nowrap">
        <LeftSideWrapper>
          <OrderCard
            marketPriceFormatted={marketPriceFormatted}
            isLoading={isLoadingCardData}
            handleOrderBookClick={handleToggleOrderBook}
          />
          <Collapse in={isOrderBookExpanded} collapsedSize={0} orientation="horizontal">
            <OrderBookCard
              data={orderBook.data}
              isLoadingWithArgsUpdated={orderBook.isLoadingWithArgsUpdated}
              orderBookAssets={orderBookAssets}
              handleCloseOrderBook={handleCloseOrderBook}
            />
          </Collapse>
        </LeftSideWrapper>

        <RightSideWrapper>
          <MarketData
            isLoadingMarketData={isLoadingCardData || orderBook.isLoadingWithArgsUpdated}
            marketPrice={orderBook.currentData?.marketPrice}
          />
        </RightSideWrapper>
      </ContentWrapper>

      {isWalletConnected && (
        <MyOrdersWrapper display="flex" flexDirection="column" mt="40px">
          <TableHeader
            label={'My Orders'}
            orderStatus={orderStatus}
            handleOrderStatusChange={handleOrderStatusChange}
          />

          <EnhancedTableContainer
            orders={ordersRows}
            headlines={tableHeadlines}
            isInitialLoading={isLoadingTableData}
            isLoading={isLoadingWithArgsUpdated}
            sortState={sortState}
            handleSortChange={handleTableContainerSortChange}
            expandedRowId={expandedRowId}
            setExpandedRowId={setExpandedRowId}
          />

          <TablePagination isLoading={isFetchingOrders} {...pagination} />
        </MyOrdersWrapper>
      )}
    </Grid>
  );
};

const ContentWrapper = styled(Grid)(({ theme }) => ({
  [theme.breakpoints.down('md')]: {
    flexDirection: 'column',
    gap: 40,
  },

  [theme.breakpoints.down('sm')]: {
    '& > div': {
      flex: 1,
      width: '100%',
    },
  },
}));

const Collapse = styled(MuiCollapse)(({ theme }) => ({
  [theme.breakpoints.down('sm')]: {
    display: 'none',
  },
}));

const MyOrdersWrapper = styled(Grid)(({ theme }) => ({
  [theme.breakpoints.down('sm')]: {
    display: 'none',
  },
}));

const LeftSideWrapper = styled(Grid)(({ theme }) => ({
  display: 'flex',
  background: '#171D2D',
  borderRadius: theme.borderRadius.md,
  width: 'fit-content',
}));

const RightSideWrapper = styled(Grid)(({ theme }) => ({
  flexGrow: '1',

  [theme.breakpoints.down('md')]: {
    width: '100%',
  },

  [theme.breakpoints.down('sm')]: {
    padding: '0 20px',
    paddingBottom: '30px',
  },
}));

export default SwapPageContent;
