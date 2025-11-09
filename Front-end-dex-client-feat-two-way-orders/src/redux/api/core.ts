import { base as api } from './base';

const injectedRtkApi = api.injectEndpoints({
  endpoints: (build) => ({
    cancelTwoWayOrder: build.mutation<
      CancelTwoWayOrderApiResponse,
      CancelTwoWayOrderApiArg
    >({
      query: (queryArg) => ({
        url: `/two-way-order/cancel`,
        method: 'POST',
        body: queryArg.twoWayOrderCancel,
      }),
    }),
    postTwoWayOrderCancel: build.mutation<
      PostTwoWayOrderCancelApiResponse,
      PostTwoWayOrderCancelApiArg
    >({
      query: (queryArg) => ({
        url: `/two-way-order/cancel`,
        method: 'POST',
        body: queryArg.twoWayOrderCancelRequest,
      }),
    }),
    getAssetCirculatingSupply: build.query<
      GetAssetCirculatingSupplyApiResponse,
      GetAssetCirculatingSupplyApiArg
    >({
      query: (queryArg) => ({ url: `/circulating-supply/${queryArg.assetId}` }),
    }),
    listOrderSaleProjects: build.query<
      ListOrderSaleProjectsApiResponse,
      ListOrderSaleProjectsApiArg
    >({
      query: (queryArg) => ({
        url: `/order-sale/projects`,
        params: {
          status: queryArg.status,
          annotateWalletStakeKeyHash: queryArg.annotateWalletStakeKeyHash,
          count: queryArg.count,
          cursor: queryArg.cursor,
        },
      }),
    }),
    getOrderSaleProject: build.query<
      GetOrderSaleProjectApiResponse,
      GetOrderSaleProjectApiArg
    >({
      query: (queryArg) => ({
        url: `/order-sale/project/${queryArg.orderSaleProjectId}`,
        params: { annotateWalletStakeKeyHash: queryArg.annotateWalletStakeKeyHash },
      }),
    }),
    listOrderSalePortfolioProjects: build.query<
      ListOrderSalePortfolioProjectsApiResponse,
      ListOrderSalePortfolioProjectsApiArg
    >({
      query: (queryArg) => ({
        url: `/order-sale/portfolio`,
        params: {
          filterByWalletStakeKeyHash: queryArg.filterByWalletStakeKeyHash,
          count: queryArg.count,
          cursor: queryArg.cursor,
        },
      }),
    }),
    listSwapOrders: build.query<ListSwapOrdersApiResponse, ListSwapOrdersApiArg>({
      query: (queryArg) => ({
        url: `/order-swap`,
        params: {
          sortSwapOrders: queryArg.sortSwapOrders,
          search: queryArg.search,
          filterByAssetId: queryArg.filterByAssetId,
          filterByToAssetId: queryArg.filterByToAssetId,
          filterByFromAssetId: queryArg.filterByFromAssetId,
          orderId: queryArg.orderId,
          filterByWalletStakeKeyHash: queryArg.filterByWalletStakeKeyHash,
          filterByCreatedLte: queryArg.filterByCreatedLte,
          filterByCreatedGte: queryArg.filterByCreatedGte,
          filterByOwner: queryArg.filterByOwner,
          filterByOrderSwapStatus: queryArg.filterByOrderSwapStatus,
          filterByOrderSwapType: queryArg.filterByOrderSwapType,
          filterByMinPrice: queryArg.filterByMinPrice,
          filterByMaxPrice: queryArg.filterByMaxPrice,
          count: queryArg.count,
          cursor: queryArg.cursor,
        },
      }),
    }),
    findBestAvailableSwapOrders: build.query<
      FindBestAvailableSwapOrdersApiResponse,
      FindBestAvailableSwapOrdersApiArg
    >({
      query: (queryArg) => ({
        url: `/order-swap/best-available`,
        params: {
          toAssetId: queryArg.toAssetId,
          fromAssetId: queryArg.fromAssetId,
          toAssetAmount: queryArg.toAssetAmount,
          fromAssetAmount: queryArg.fromAssetAmount,
          slippagePercent: queryArg.slippagePercent,
        },
      }),
    }),
    getSwapOrder: build.query<GetSwapOrderApiResponse, GetSwapOrderApiArg>({
      query: (queryArg) => ({ url: `/order-swap/${queryArg.orderId}` }),
    }),
    getSwapOrderOpenFee: build.mutation<
      GetSwapOrderOpenFeeApiResponse,
      GetSwapOrderOpenFeeApiArg
    >({
      query: (queryArg) => ({
        url: `/order-swap/open/fee`,
        method: 'POST',
        body: queryArg.openSwapOrder,
      }),
    }),
    getSaleOrder: build.query<GetSaleOrderApiResponse, GetSaleOrderApiArg>({
      query: (queryArg) => ({ url: `/order-sale/${queryArg.orderId}` }),
    }),
    openSwapOrder: build.mutation<OpenSwapOrderApiResponse, OpenSwapOrderApiArg>({
      query: (queryArg) => ({
        url: `/order-swap/open`,
        method: 'POST',
        body: queryArg.openSwapOrder,
      }),
    }),
    getSaleOrderFee: build.mutation<GetSaleOrderFeeApiResponse, GetSaleOrderFeeApiArg>({
      query: (queryArg) => ({
        url: `/order-sale/fee`,
        method: 'POST',
        body: queryArg.openSaleOrder,
      }),
    }),
    openSaleOrder: build.mutation<OpenSaleOrderApiResponse, OpenSaleOrderApiArg>({
      query: (queryArg) => ({
        url: `/order-sale/open`,
        method: 'POST',
        body: queryArg.openSaleOrder,
      }),
    }),
    cancelSwapOrder: build.mutation<CancelSwapOrderApiResponse, CancelSwapOrderApiArg>({
      query: (queryArg) => ({
        url: `/order-swap/${queryArg.orderId}/cancel`,
        method: 'PUT',
        body: queryArg.cancelSwapOrder,
      }),
    }),
    fillSwapOrders: build.mutation<FillSwapOrdersApiResponse, FillSwapOrdersApiArg>({
      query: (queryArg) => ({
        url: `/order-swap/fill`,
        method: 'POST',
        body: queryArg.fillSwapOrders,
      }),
    }),
    getSwapOrderFillFee: build.mutation<
      GetSwapOrderFillFeeApiResponse,
      GetSwapOrderFillFeeApiArg
    >({
      query: (queryArg) => ({
        url: `/order-swap/fill/fee`,
        method: 'POST',
        body: queryArg.fillSwapOrders,
      }),
    }),
    cancelSaleOrder: build.mutation<CancelSaleOrderApiResponse, CancelSaleOrderApiArg>({
      query: (queryArg) => ({
        url: `/order-sale/${queryArg.orderId}/cancel`,
        method: 'PUT',
        body: queryArg.cancelSaleOrder,
      }),
    }),
    listSmartVaults: build.query<ListSmartVaultsApiResponse, ListSmartVaultsApiArg>({
      query: (queryArg) => ({
        url: `/smart-vault`,
        params: { filterByWalletStakeKeyHash: queryArg.filterByWalletStakeKeyHash },
      }),
    }),
    getSmartVault: build.query<GetSmartVaultApiResponse, GetSmartVaultApiArg>({
      query: (queryArg) => ({ url: `/smart-vault/${queryArg.smartVaultId}` }),
    }),
    listSmartVaultOperations: build.query<
      ListSmartVaultOperationsApiResponse,
      ListSmartVaultOperationsApiArg
    >({
      query: (queryArg) => ({
        url: `/smart-vault/${queryArg.smartVaultId}/operation`,
        params: { filterByWalletStakeKeyHash: queryArg.filterByWalletStakeKeyHash },
      }),
    }),
    listSmartVaultStrategies: build.query<
      ListSmartVaultStrategiesApiResponse,
      ListSmartVaultStrategiesApiArg
    >({
      query: () => ({ url: `/smart-vault/strategy` }),
    }),
    smartVaultOpen: build.mutation<SmartVaultOpenApiResponse, SmartVaultOpenApiArg>({
      query: (queryArg) => ({
        url: `/smart-vault/open`,
        method: 'POST',
        body: queryArg.smartVaultOpen,
      }),
    }),
    smartVaultDeposit: build.mutation<
      SmartVaultDepositApiResponse,
      SmartVaultDepositApiArg
    >({
      query: (queryArg) => ({
        url: `/smart-vault/deposit`,
        method: 'POST',
        body: queryArg.smartVaultDeposit,
      }),
    }),
    smartVaultWithdrawEstimate: build.mutation<
      SmartVaultWithdrawEstimateApiResponse,
      SmartVaultWithdrawEstimateApiArg
    >({
      query: (queryArg) => ({
        url: `/smart-vault/withdraw/estimate`,
        method: 'POST',
        body: queryArg.smartVaultWithdrawEstimate,
      }),
    }),
    smartVaultWithdraw: build.mutation<
      SmartVaultWithdrawApiResponse,
      SmartVaultWithdrawApiArg
    >({
      query: (queryArg) => ({
        url: `/smart-vault/withdraw`,
        method: 'POST',
        body: queryArg.smartVaultWithdraw,
      }),
    }),
    smartVaultClose: build.mutation<SmartVaultCloseApiResponse, SmartVaultCloseApiArg>({
      query: (queryArg) => ({
        url: `/smart-vault/close`,
        method: 'POST',
        body: queryArg.smartVaultClose,
      }),
    }),
    listTradingPairs: build.query<ListTradingPairsApiResponse, ListTradingPairsApiArg>({
      query: () => ({ url: `/trading-pair` }),
    }),
    listLiquidityPool: build.query<ListLiquidityPoolApiResponse, ListLiquidityPoolApiArg>(
      {
        query: (queryArg) => ({
          url: `/liquidity-pool`,
          params: {
            sort: queryArg.sort,
            search: queryArg.search,
            count: queryArg.count,
            cursor: queryArg.cursor,
          },
        }),
      },
    ),
    getLiquidityPool: build.query<GetLiquidityPoolApiResponse, GetLiquidityPoolApiArg>({
      query: (queryArg) => ({ url: `/liquidity-pool/${queryArg.liquidityPoolId}` }),
    }),
    getLiquidityPoolByAssetPair: build.query<
      GetLiquidityPoolByAssetPairApiResponse,
      GetLiquidityPoolByAssetPairApiArg
    >({
      query: (queryArg) => ({ url: `/liquidity-pool/byAssets/${queryArg.assetPair}` }),
    }),
    listLiquidityPositions: build.query<
      ListLiquidityPositionsApiResponse,
      ListLiquidityPositionsApiArg
    >({
      query: (queryArg) => ({
        url: `/liquidity-position`,
        params: {
          sort: queryArg.sort,
          search: queryArg.search,
          liquidityPositionId: queryArg.liquidityPositionId,
          walletStakeKeyHash: queryArg.walletStakeKeyHash,
          status: queryArg.status,
          filterByAssetId: queryArg.filterByAssetId,
          filterByCreatedLte: queryArg.filterByCreatedLte,
          filterByCreatedGte: queryArg.filterByCreatedGte,
          count: queryArg.count,
          cursor: queryArg.cursor,
        },
      }),
    }),
    getLiquidityPosition: build.query<
      GetLiquidityPositionApiResponse,
      GetLiquidityPositionApiArg
    >({
      query: (queryArg) => ({
        url: `/liquidity-position/${queryArg.liquidityPositionId}`,
      }),
    }),
    openLiquidityPosition: build.mutation<
      OpenLiquidityPositionApiResponse,
      OpenLiquidityPositionApiArg
    >({
      query: (queryArg) => ({
        url: `/liquidity-position/open`,
        method: 'POST',
        body: queryArg.openLiquidityPosition,
      }),
    }),
    closeLiquidityPosition: build.mutation<
      CloseLiquidityPositionApiResponse,
      CloseLiquidityPositionApiArg
    >({
      query: (queryArg) => ({
        url: `/liquidity-position/${queryArg.liquidityPositionId}/close`,
        method: 'PUT',
        body: queryArg.liquidityPositionClose,
      }),
    }),
    submitTransaction: build.mutation<
      SubmitTransactionApiResponse,
      SubmitTransactionApiArg
    >({
      query: (queryArg) => ({
        url: `/transaction/submit`,
        method: 'POST',
        body: queryArg.signedTransaction,
      }),
    }),
    getOrderBookByAssets: build.query<
      GetOrderBookByAssetsApiResponse,
      GetOrderBookByAssetsApiArg
    >({
      query: (queryArg) => ({ url: `/order-book/by-asset-pair/${queryArg.assetPair}` }),
    }),
    getOrderSwapAggregatedPrices: build.query<
      GetOrderSwapAggregatedPricesApiResponse,
      GetOrderSwapAggregatedPricesApiArg
    >({
      query: (queryArg) => ({
        url: `/market/by-asset-pair/${queryArg.assetPair}/agg-price-history`,
        params: {
          startTime: queryArg.startTime,
          endTime: queryArg.endTime,
          binInterval: queryArg.binInterval,
        },
      }),
    }),
    getOrderSwapKlineAggregatedPrices: build.query<
      GetOrderSwapKlineAggregatedPricesApiResponse,
      GetOrderSwapKlineAggregatedPricesApiArg
    >({
      query: (queryArg) => ({
        url: `/market/by-asset-pair/${queryArg.assetPair}/kline`,
        params: {
          startTime: queryArg.startTime,
          endTime: queryArg.endTime,
          binInterval: queryArg.binInterval,
        },
      }),
    }),
    getOrderSwapMarketMakerBinnedOrders: build.query<
      GetOrderSwapMarketMakerBinnedOrdersApiResponse,
      GetOrderSwapMarketMakerBinnedOrdersApiArg
    >({
      query: (queryArg) => ({
        url: `/market/by-asset-pair/${queryArg.assetPair}/maker-metrics/binned-orders`,
        params: {
          filterByWalletStakeKeyHash: queryArg.filterByWalletStakeKeyHash,
          startTime: queryArg.startTime,
          endTime: queryArg.endTime,
          binInterval: queryArg.binInterval,
        },
      }),
    }),
    listOrderBook: build.query<ListOrderBookApiResponse, ListOrderBookApiArg>({
      query: (queryArg) => ({
        url: `/market/liquidity-pool/${queryArg.liquidityPoolId}/order-book`,
        params: {
          count: queryArg.count,
          marketPrecisionFilter: queryArg.marketPrecisionFilter,
        },
      }),
    }),
    listLiquidityPositionsDistribution: build.query<
      ListLiquidityPositionsDistributionApiResponse,
      ListLiquidityPositionsDistributionApiArg
    >({
      query: (queryArg) => ({
        url: `/market/liquidity-pool/${queryArg.liquidityPoolId}/liquidity-distribution`,
        params: {
          startTime: queryArg.startTime,
          endTime: queryArg.endTime,
          count: queryArg.count,
        },
      }),
    }),
    listLiquidityPositionsTradeVolume: build.query<
      ListLiquidityPositionsTradeVolumeApiResponse,
      ListLiquidityPositionsTradeVolumeApiArg
    >({
      query: (queryArg) => ({
        url: `/market/liquidity-pool/${queryArg.liquidityPoolId}/trade-volume`,
        params: {
          startTime: queryArg.startTime,
          endTime: queryArg.endTime,
          count: queryArg.count,
        },
      }),
    }),
    listLiquidityPositionsTvl: build.query<
      ListLiquidityPositionsTvlApiResponse,
      ListLiquidityPositionsTvlApiArg
    >({
      query: (queryArg) => ({
        url: `/market/liquidity-pool/${queryArg.liquidityPoolId}/total-volume-locked`,
        params: {
          startTime: queryArg.startTime,
          endTime: queryArg.endTime,
          count: queryArg.count,
        },
      }),
    }),
    listTradingWallets: build.query<
      ListTradingWalletsApiResponse,
      ListTradingWalletsApiArg
    >({
      query: (queryArg) => ({
        url: `/trading-wallet`,
        params: {
          filterByWalletStakeKeyHash: queryArg.filterByWalletStakeKeyHash,
          filterByAssetPair: queryArg.filterByAssetPair,
          filterTradingWalletRuntimeLte: queryArg.filterTradingWalletRuntimeLte,
          filterTradingWalletRuntimeGte: queryArg.filterTradingWalletRuntimeGte,
          sortTradingWalletOrderBy: queryArg.sortTradingWalletOrderBy,
          count: queryArg.count,
          cursor: queryArg.cursor,
        },
      }),
    }),
    getTradingWallet: build.query<GetTradingWalletApiResponse, GetTradingWalletApiArg>({
      query: (queryArg) => ({ url: `/trading-wallet/${queryArg.tradingWalletId}` }),
    }),
    registerTradingWallet: build.mutation<
      RegisterTradingWalletApiResponse,
      RegisterTradingWalletApiArg
    >({
      query: (queryArg) => ({
        url: `/trading-wallet/register`,
        method: 'POST',
        body: queryArg.registerTradingWallet,
      }),
    }),
    connectWallet: build.mutation<ConnectWalletApiResponse, ConnectWalletApiArg>({
      query: (queryArg) => ({
        url: `/user/connect`,
        method: 'POST',
        body: queryArg.userConnect,
      }),
    }),
    createSumsubEvent: build.mutation<
      CreateSumsubEventApiResponse,
      CreateSumsubEventApiArg
    >({
      query: (queryArg) => ({
        url: `/user/event-sumsub`,
        method: 'POST',
        body: queryArg.kycSumsubEvent,
      }),
    }),
    listStakingProjects: build.query<
      ListStakingProjectsApiResponse,
      ListStakingProjectsApiArg
    >({
      query: (queryArg) => ({
        url: `/staking-projects`,
        params: { count: queryArg.count, cursor: queryArg.cursor },
      }),
    }),
    listStakingProjectNfts: build.mutation<
      ListStakingProjectNftsApiResponse,
      ListStakingProjectNftsApiArg
    >({
      query: (queryArg) => ({
        url: `/staking-project/${queryArg.stakingProjectId}/nfts`,
        method: 'POST',
        body: queryArg.stakingProjectNftsRequest,
      }),
    }),
    listStakeVaults: build.query<ListStakeVaultsApiResponse, ListStakeVaultsApiArg>({
      query: (queryArg) => ({
        url: `/stake-vaults`,
        params: {
          filterByWalletStakeKeyHash: queryArg.filterByWalletStakeKeyHash,
          count: queryArg.count,
          cursor: queryArg.cursor,
        },
      }),
    }),
    getStakeVaultNftUsageReport: build.query<
      GetStakeVaultNftUsageReportApiResponse,
      GetStakeVaultNftUsageReportApiArg
    >({
      query: (queryArg) => ({ url: `/stake-vault/nft-usage-report/${queryArg.assetId}` }),
    }),
    createStakeVault: build.mutation<CreateStakeVaultApiResponse, CreateStakeVaultApiArg>(
      {
        query: (queryArg) => ({
          url: `/stake-vault/create`,
          method: 'POST',
          body: queryArg.createStakeVault,
        }),
      },
    ),
    unstakeStakeVault: build.mutation<
      UnstakeStakeVaultApiResponse,
      UnstakeStakeVaultApiArg
    >({
      query: (queryArg) => ({
        url: `/stake-vault/unstake`,
        method: 'POST',
        body: queryArg.unstakeStakeVault,
      }),
    }),
    getStakeVaultCreateRewardsEstimate: build.mutation<
      GetStakeVaultCreateRewardsEstimateApiResponse,
      GetStakeVaultCreateRewardsEstimateApiArg
    >({
      query: (queryArg) => ({
        url: `/stake-vault/create/rewards-estimate`,
        method: 'POST',
        body: queryArg.createStakeVault,
      }),
    }),
    yieldFarmingListRewards: build.query<
      YieldFarmingListRewardsApiResponse,
      YieldFarmingListRewardsApiArg
    >({
      query: (queryArg) => ({
        url: `/yield-farming/rewards`,
        params: { count: queryArg.count, cursor: queryArg.cursor },
      }),
    }),
    yieldFarmingRewardsClaim: build.mutation<
      YieldFarmingRewardsClaimApiResponse,
      YieldFarmingRewardsClaimApiArg
    >({
      query: (queryArg) => ({
        url: `/yield-farming/rewards/claim`,
        method: 'POST',
        body: queryArg.yieldFarmingRewardsClaim,
      }),
    }),
    createOption: build.mutation<CreateOptionApiResponse, CreateOptionApiArg>({
      query: (queryArg) => ({
        url: `/option/create`,
        method: 'POST',
        body: queryArg.createOption,
      }),
    }),
    retrieveOption: build.mutation<RetrieveOptionApiResponse, RetrieveOptionApiArg>({
      query: (queryArg) => ({
        url: `/option/retrieve`,
        method: 'POST',
        body: queryArg.retrieveOption,
      }),
    }),
    executeOption: build.mutation<ExecuteOptionApiResponse, ExecuteOptionApiArg>({
      query: (queryArg) => ({
        url: `/option/execute`,
        method: 'POST',
        body: queryArg.executeOption,
      }),
    }),
    termsAccept: build.mutation<TermsAcceptApiResponse, TermsAcceptApiArg>({
      query: (queryArg) => ({
        url: `/terms/accept`,
        method: 'POST',
        body: queryArg.termsAccept,
      }),
    }),
    getTwoWayOrders: build.query<GetTwoWayOrdersApiResponse, GetTwoWayOrdersApiArg>({
      query: () => ({ url: `/two-way-order` }),
    }),
    getTwoWayOrderById: build.query<
      GetTwoWayOrderByIdApiResponse,
      GetTwoWayOrderByIdApiArg
    >({
      query: (queryArg) => ({ url: `/two-way-order/${queryArg.orderId}` }),
    }),
    placeTwoWayOrder: build.mutation<PlaceTwoWayOrderApiResponse, PlaceTwoWayOrderApiArg>(
      {
        query: (queryArg) => ({
          url: `/two-way-order/place`,
          method: 'POST',
          body: queryArg.twoWayOrderPlace,
        }),
      },
    ),
    fillTwoWayOrder: build.mutation<FillTwoWayOrderApiResponse, FillTwoWayOrderApiArg>({
      query: (queryArg) => ({
        url: `/two-way-order/fill`,
        method: 'POST',
        body: queryArg.twoWayOrderFill,
      }),
    }),
    getTwoWayOrderHistory: build.query<
      GetTwoWayOrderHistoryApiResponse,
      GetTwoWayOrderHistoryApiArg
    >({
      query: (queryArg) => ({ url: `/two-way-order/${queryArg.orderId}/history` }),
    }),
    getSlvBalance: build.query<GetSlvBalanceApiResponse, GetSlvBalanceApiArg>({
      query: () => ({ url: `/slv/balance` }),
    }),
  }),
  overrideExisting: false,
});
export { injectedRtkApi as core };
export type CancelTwoWayOrderApiResponse =
  /** status 200 Unsigned transaction payload ready for signing */ UnsignedTransaction;
export type CancelTwoWayOrderApiArg = {
  twoWayOrderCancel: TwoWayOrderCancel;
};
export type PostTwoWayOrderCancelApiResponse =
  /** status 200 Unsigned transaction payload ready for signing */ UnsignedTransaction;
export type PostTwoWayOrderCancelApiArg = {
  twoWayOrderCancelRequest: TwoWayOrderCancelRequest;
};
export type GetAssetCirculatingSupplyApiResponse =
  /** status 200 Successful operation */ CirculatingSupply;
export type GetAssetCirculatingSupplyApiArg = {
  /** ID of an Asset */
  assetId: string;
};
export type ListOrderSaleProjectsApiResponse =
  /** status 200 Successful operation */ OrderSaleProjectResults;
export type ListOrderSaleProjectsApiArg = {
  /** Filter results by exact project's status values comma separated */
  status?: OrderSaleProjectRoundStatus[];
  /** Annotate results applying semantic specific to a walletStakeKeyHash (eg buy conditions) */
  annotateWalletStakeKeyHash?: string;
  /** Count / limit which determines page size */
  count?: number;
  /** Cursor based pagination next item */
  cursor?: string;
};
export type GetOrderSaleProjectApiResponse =
  /** status 200 Successful operation */ OrderSaleProject;
export type GetOrderSaleProjectApiArg = {
  /** ID of OrderSaleProject to return */
  orderSaleProjectId: string;
  /** Annotate results applying semantic specific to a walletStakeKeyHash (eg buy conditions) */
  annotateWalletStakeKeyHash?: string;
};
export type ListOrderSalePortfolioProjectsApiResponse =
  /** status 200 Successful operation */ OrderSalePortfolioResults;
export type ListOrderSalePortfolioProjectsApiArg = {
  /** Filter results by a single wallet stake key hash */
  filterByWalletStakeKeyHash?: string;
  /** Count / limit which determines page size */
  count?: number;
  /** Cursor based pagination next item */
  cursor?: string;
};
export type ListSwapOrdersApiResponse =
  /** status 200 Successful operation */ SwapOrderResults;
export type ListSwapOrdersApiArg = {
  /** Order results by field value and direction (+ for ascending, - for descending) */
  sortSwapOrders?: SwapOrderSortByOptions;
  /** Multi-value comma separates cross field search:
    assetId, policyId, assetName, shortName, longName
     */
  search?: string[];
  /** Filter results by exact assetId values comma separated */
  filterByAssetId?: string[];
  /** Filter results by exact TO assetId values comma separated */
  filterByToAssetId?: string[];
  /** Filter results by exact FROM assetId values comma separated */
  filterByFromAssetId?: string[];
  /** Filter results by exact orderId values comma separated */
  orderId?: string[];
  /** Filter results by a single wallet stake key hash */
  filterByWalletStakeKeyHash?: string;
  /** Filter results where created value is less than or equal */
  filterByCreatedLte?: string;
  /** Filter results where created value is greater than or equal */
  filterByCreatedGte?: string;
  /** Filter orders by owner */
  filterByOwner?: boolean;
  /** Filter orders by their status */
  filterByOrderSwapStatus?: SwapOrderStatus;
  /** Filter orders by their type */
  filterByOrderSwapType?: SwapOrderType | SwapOrderFillType;
  /** Filter orders by minimum price */
  filterByMinPrice?: string;
  /** Filter orders by maximum price */
  filterByMaxPrice?: string;
  /** Count / limit which determines page size */
  count?: number;
  /** Cursor based pagination next item */
  cursor?: string;
};
export type FindBestAvailableSwapOrdersApiResponse =
  /** status 200 Successful operation */ BestAvailableSwapOrderResults;
export type FindBestAvailableSwapOrdersApiArg = {
  /** Find orders with this toAssetId */
  toAssetId: string;
  /** Find orders with this fromAssetId */
  fromAssetId: string;
  /** Find orders with toAssetAmount equal or above to this value */
  toAssetAmount?: string;
  /** Find orders with fromAssetAmount equal or above to this value */
  fromAssetAmount?: string;
  /** Find orders with slippagePercent equal or below to this value */
  slippagePercent?: string;
};
export type GetSwapOrderApiResponse = /** status 200 Successful operation */ SwapOrder;
export type GetSwapOrderApiArg = {
  /** Unique identifier for Order */
  orderId: string;
};
export type GetSwapOrderOpenFeeApiResponse =
  /** status 200 Successful operation */ SwapOrderMakerTotalFeesDeposit;
export type GetSwapOrderOpenFeeApiArg = {
  /** Get a swap order open fee */
  openSwapOrder: OpenSwapOrder;
};
export type GetSaleOrderApiResponse = /** status 200 Successful operation */ SaleOrder;
export type GetSaleOrderApiArg = {
  /** Unique identifier for Order */
  orderId: string;
};
export type OpenSwapOrderApiResponse =
  /** status 201 Successful operation */ UnsignedTransaction;
export type OpenSwapOrderApiArg = {
  /** Open a new order */
  openSwapOrder: OpenSwapOrder;
};
export type GetSaleOrderFeeApiResponse =
  /** status 200 Successful operation */ SaleOrderTotalFeesDeposit;
export type GetSaleOrderFeeApiArg = {
  /** Get a sale order fee */
  openSaleOrder: OpenSaleOrder;
};
export type OpenSaleOrderApiResponse =
  /** status 201 Successful operation */ UnsignedSaleOrder;
export type OpenSaleOrderApiArg = {
  /** Open a new sale order */
  openSaleOrder: OpenSaleOrder;
};
export type CancelSwapOrderApiResponse =
  /** status 200 Successful operation */ UnsignedTransaction;
export type CancelSwapOrderApiArg = {
  /** Unique identifier for Order */
  orderId: string;
  /** Cancel a swap order */
  cancelSwapOrder: CancelSwapOrder;
};
export type FillSwapOrdersApiResponse =
  /** status 200 Successful operation */ UnsignedTransaction;
export type FillSwapOrdersApiArg = {
  /** Fill single or multiple existing swap orders */
  fillSwapOrders: FillSwapOrders;
};
export type GetSwapOrderFillFeeApiResponse =
  /** status 200 Successful operation */ SwapOrderTakerTotalFees;
export type GetSwapOrderFillFeeApiArg = {
  /** Get swap orders fill fee */
  fillSwapOrders: FillSwapOrders;
};
export type CancelSaleOrderApiResponse =
  /** status 200 Successful operation */ UnsignedSaleOrder;
export type CancelSaleOrderApiArg = {
  /** Unique identifier for Order */
  orderId: string;
  /** Cancel a sale order */
  cancelSaleOrder: CancelSaleOrder;
};
export type ListSmartVaultsApiResponse =
  /** status 200 Successful operation */ SmartVaultListResult;
export type ListSmartVaultsApiArg = {
  /** Filter results by a single wallet stake key hash */
  filterByWalletStakeKeyHash?: string;
};
export type GetSmartVaultApiResponse =
  /** status 200 Successful operation */ SmartVaultResult;
export type GetSmartVaultApiArg = {
  /** ID of Smart Vault to return */
  smartVaultId: SmartVaultId;
};
export type ListSmartVaultOperationsApiResponse =
  /** status 200 Successful operation */ SmartVaultOperationListResult;
export type ListSmartVaultOperationsApiArg = {
  /** ID of Smart Vault to return */
  smartVaultId: SmartVaultId;
  /** Filter results by a single wallet stake key hash */
  filterByWalletStakeKeyHash?: string;
};
export type ListSmartVaultStrategiesApiResponse =
  /** status 200 Successful operation */ SmartVaultStrategyListResult;
export type ListSmartVaultStrategiesApiArg = void;
export type SmartVaultOpenApiResponse =
  /** status 201 Successful operation */ UnsignedTransaction;
export type SmartVaultOpenApiArg = {
  smartVaultOpen: SmartVaultOpen;
};
export type SmartVaultDepositApiResponse =
  /** status 201 Successful operation */ UnsignedTransaction;
export type SmartVaultDepositApiArg = {
  smartVaultDeposit: SmartVaultDeposit;
};
export type SmartVaultWithdrawEstimateApiResponse =
  /** status 201 Successful operation */ SmartVaultWithdrawEstimateResult;
export type SmartVaultWithdrawEstimateApiArg = {
  smartVaultWithdrawEstimate: SmartVaultWithdrawEstimate;
};
export type SmartVaultWithdrawApiResponse =
  /** status 201 Successful operation */ UnsignedTransaction;
export type SmartVaultWithdrawApiArg = {
  smartVaultWithdraw: SmartVaultWithdraw;
};
export type SmartVaultCloseApiResponse =
  /** status 201 Successful operation */ UnsignedTransaction;
export type SmartVaultCloseApiArg = {
  smartVaultClose: SmartVaultClose;
};
export type ListTradingPairsApiResponse =
  /** status 200 Successful operation */ TradingPairsResults;
export type ListTradingPairsApiArg = void;
export type ListLiquidityPoolApiResponse =
  /** status 200 Successful operation */ LiquidityPoolsResults;
export type ListLiquidityPoolApiArg = {
  /** Order results by field value and direction (+az, -za) */
  sort?: string;
  /** Multi-value comma separates cross field search:
    assetId, policyId, assetName, shortName, longName
     */
  search?: string[];
  /** Count / limit which determines page size */
  count?: number;
  /** Cursor based pagination next item */
  cursor?: string;
};
export type GetLiquidityPoolApiResponse =
  /** status 200 Successful operation */ LiquidityPool;
export type GetLiquidityPoolApiArg = {
  /** ID of liquidityPool to perform action on */
  liquidityPoolId: LiquidityPoolReference;
};
export type GetLiquidityPoolByAssetPairApiResponse =
  /** status 200 Successful operation */ LiquidityPool;
export type GetLiquidityPoolByAssetPairApiArg = {
  /** Asset pair in the format "asset1-asset2" */
  assetPair: string;
};
export type ListLiquidityPositionsApiResponse = /** status 200 Successful operation */ {
  count?: number;
  next?: string;
  previous?: string;
  results?: LiquidityPosition[];
};
export type ListLiquidityPositionsApiArg = {
  /** Order results by field value and direction (+az, -za) */
  sort?: string;
  /** Multi-value comma separates cross field search:
    assetId, policyId, assetName, shortName, longName
     */
  search?: string[];
  /** Filter results by exact liquidityPositionId values comma separated */
  liquidityPositionId?: string[];
  /** Filter results by exact filterWalletStakeKeyHash values comma separated */
  walletStakeKeyHash?: string[];
  /** Filter results by exact liquidity position status values comma separated */
  status?: LiquidityPositionStatus[];
  /** Filter results by exact assetId values comma separated */
  filterByAssetId?: string[];
  /** Filter results where created value is less than or equal */
  filterByCreatedLte?: string;
  /** Filter results where created value is greater than or equal */
  filterByCreatedGte?: string;
  /** Count / limit which determines page size */
  count?: number;
  /** Cursor based pagination next item */
  cursor?: string;
};
export type GetLiquidityPositionApiResponse =
  /** status 200 Successful operation */ LiquidityPosition;
export type GetLiquidityPositionApiArg = {
  /** ID of LP to return */
  liquidityPositionId: string;
};
export type OpenLiquidityPositionApiResponse =
  /** status 201 Successful operation */ UnsignedLiquidityPosition;
export type OpenLiquidityPositionApiArg = {
  /** Open a new liquidity position */
  openLiquidityPosition: OpenLiquidityPosition;
};
export type CloseLiquidityPositionApiResponse =
  /** status 200 Successful operation */ UnsignedLiquidityPosition;
export type CloseLiquidityPositionApiArg = {
  /** ID of LP to close */
  liquidityPositionId: string;
  /** Close a a liquidity position */
  liquidityPositionClose: LiquidityPositionClose;
};
export type SubmitTransactionApiResponse =
  /** status 200 Transaction has been submitted */
  | TransactionSubmitSuccessResponse
  | /** status 202 Transaction has been queued to be submitted */ TransactionSubmitAcceptedResponse;
export type SubmitTransactionApiArg = {
  /** Submit transaction to block chain */
  signedTransaction: SignedTransaction;
};
export type GetOrderBookByAssetsApiResponse =
  /** status 200 Successful operation */ OrderBook;
export type GetOrderBookByAssetsApiArg = {
  /** Asset pair in the format "asset1-asset2" */
  assetPair: string;
};
export type GetOrderSwapAggregatedPricesApiResponse =
  /** status 200 Successful operation */ MarketAggPrice;
export type GetOrderSwapAggregatedPricesApiArg = {
  /** Asset pair in the format "asset1-asset2" */
  assetPair: string;
  /** Filter from start time (datetime ISO8601) */
  startTime: string;
  /** Filter before end time (datetime ISO8601) */
  endTime: string;
  /** The time interval of the Kline data. */
  binInterval: '15m' | '30m' | '1h' | '4h' | '1d' | '1w';
};
export type GetOrderSwapKlineAggregatedPricesApiResponse =
  /** status 200 Successful operation */ MarketKline;
export type GetOrderSwapKlineAggregatedPricesApiArg = {
  /** Asset pair in the format "asset1-asset2" */
  assetPair: string;
  /** Filter from start time (datetime ISO8601) */
  startTime: string;
  /** Filter before end time (datetime ISO8601) */
  endTime: string;
  /** The time interval of the Kline data. */
  binInterval: '15m' | '30m' | '1h' | '4h' | '1d' | '1w';
};
export type GetOrderSwapMarketMakerBinnedOrdersApiResponse =
  /** status 200 Successful operation */ MarketMakerMetricsBinnedOrders;
export type GetOrderSwapMarketMakerBinnedOrdersApiArg = {
  /** Asset pair in the format "asset1-asset2" */
  assetPair: string;
  /** Filter results by a single wallet stake key hash */
  filterByWalletStakeKeyHash?: string;
  /** Filter from start time (datetime ISO8601) */
  startTime: string;
  /** Filter before end time (datetime ISO8601) */
  endTime: string;
  /** The time interval of the Kline data. */
  binInterval: '15m' | '30m' | '1h' | '4h' | '1d' | '1w';
};
export type ListOrderBookApiResponse =
  /** status 200 Successful operation */ MarketOrderBook[];
export type ListOrderBookApiArg = {
  /** ID of liquidityPool to perform action on */
  liquidityPoolId: LiquidityPoolReference;
  /** Limit of samples that will be returned */
  count?: number;
  /** Filter samples that will be returned */
  marketPrecisionFilter?: string;
};
export type ListLiquidityPositionsDistributionApiResponse =
  /** status 200 Successful operation */ MarketLiquidityDistribution[];
export type ListLiquidityPositionsDistributionApiArg = {
  /** ID of liquidityPool to perform action on */
  liquidityPoolId: LiquidityPoolReference;
  /** Filter from start time (datetime ISO8601) */
  startTime: string;
  /** Filter before end time (datetime ISO8601) */
  endTime: string;
  /** Limit of samples that will be returned */
  count?: number;
};
export type ListLiquidityPositionsTradeVolumeApiResponse =
  /** status 200 Successful operation */ MarketTradeVolume[];
export type ListLiquidityPositionsTradeVolumeApiArg = {
  /** ID of liquidityPool to perform action on */
  liquidityPoolId: LiquidityPoolReference;
  /** Filter from start time (datetime ISO8601) */
  startTime: string;
  /** Filter before end time (datetime ISO8601) */
  endTime: string;
  /** Limit of samples that will be returned */
  count?: number;
};
export type ListLiquidityPositionsTvlApiResponse =
  /** status 200 Successful operation */ MarketTotalVolumeLocked[];
export type ListLiquidityPositionsTvlApiArg = {
  /** ID of liquidityPool to perform action on */
  liquidityPoolId: LiquidityPoolReference;
  /** Filter from start time (datetime ISO8601) */
  startTime: string;
  /** Filter before end time (datetime ISO8601) */
  endTime: string;
  /** Limit of samples that will be returned */
  count?: number;
};
export type ListTradingWalletsApiResponse =
  /** status 200 Successful operation */ TradingWalletsResult;
export type ListTradingWalletsApiArg = {
  /** Filter results by a single wallet stake key hash */
  filterByWalletStakeKeyHash?: string;
  /** Filter results by a pair of assets in the format "assetId1-assetId2" */
  filterByAssetPair?: string;
  /** Filter trading wallet results where runtime seconds less than or equal */
  filterTradingWalletRuntimeLte?: number;
  /** Filter trading wallet results where runtime seconds is greater than or equal */
  filterTradingWalletRuntimeGte?: number;
  /** Order results by field value and direction (+ for ascending, - for descending) */
  sortTradingWalletOrderBy?: TradingWalletSortByOptions;
  /** Count / limit which determines page size */
  count?: number;
  /** Cursor based pagination next item */
  cursor?: string;
};
export type GetTradingWalletApiResponse =
  /** status 200 Successful operation */ TradingWalletResult;
export type GetTradingWalletApiArg = {
  /** identifier of TradingWallet */
  tradingWalletId: TradingWalletId;
};
export type RegisterTradingWalletApiResponse =
  /** status 201 Successful operation */ TradingWalletRegisterResult;
export type RegisterTradingWalletApiArg = {
  /** Upsert and follow a Trading Wallet */
  registerTradingWallet: RegisterTradingWallet;
};
export type ConnectWalletApiResponse =
  /** status 200 Successful operation */ UserConnectResponse;
export type ConnectWalletApiArg = {
  /** a user connected wallet instance */
  userConnect: UserConnect;
};
export type CreateSumsubEventApiResponse = /** status 200 Successful operation */ void;
export type CreateSumsubEventApiArg = {
  /** an applicant status update from Sumsub */
  kycSumsubEvent: KycSumsubEvent;
};
export type ListStakingProjectsApiResponse =
  /** status 200 Successful operation */ StakingProjectsResult;
export type ListStakingProjectsApiArg = {
  /** Count / limit which determines page size */
  count?: number;
  /** Cursor based pagination next item */
  cursor?: string;
};
export type ListStakingProjectNftsApiResponse =
  /** status 200 Successful operation */ StakingProjectNftsResult;
export type ListStakingProjectNftsApiArg = {
  /** ID of Staking project to return */
  stakingProjectId: string;
  /** Get list of NFTs which can be applied to a stake vault */
  stakingProjectNftsRequest: StakingProjectNftsRequest;
};
export type ListStakeVaultsApiResponse =
  /** status 200 Successful operation */ StakeVaultsResult;
export type ListStakeVaultsApiArg = {
  /** Filter results by a single wallet stake key hash */
  filterByWalletStakeKeyHash?: string;
  /** Count / limit which determines page size */
  count?: number;
  /** Cursor based pagination next item */
  cursor?: string;
};
export type GetStakeVaultNftUsageReportApiResponse =
  /** status 200 Successful operation */ StakeVaultNftUsageReport;
export type GetStakeVaultNftUsageReportApiArg = {
  /** ID of an Asset */
  assetId: string;
};
export type CreateStakeVaultApiResponse =
  /** status 201 Successful operation */ UnsignedStakeVault;
export type CreateStakeVaultApiArg = {
  /** Create Stake Vault */
  createStakeVault: CreateStakeVault;
};
export type UnstakeStakeVaultApiResponse =
  /** status 201 Successful operation */ UnsignedUnstakeStakeVault;
export type UnstakeStakeVaultApiArg = {
  /** Unstake Stake Vault */
  unstakeStakeVault: UnstakeStakeVault;
};
export type GetStakeVaultCreateRewardsEstimateApiResponse =
  /** status 200 Successful operation */ StakeVaultCreateRewardsEstimateResponse;
export type GetStakeVaultCreateRewardsEstimateApiArg = {
  /** Returns the estimated total rewards the stake vault will yield */
  createStakeVault: CreateStakeVault;
};
export type YieldFarmingListRewardsApiResponse =
  /** status 200 Successful operation */ YieldFarmingRewardsResult;
export type YieldFarmingListRewardsApiArg = {
  /** Count / limit which determines page size */
  count?: number;
  /** Cursor based pagination next item */
  cursor?: string;
};
export type YieldFarmingRewardsClaimApiResponse =
  /** status 201 Successful operation */ UnsignedTransaction;
export type YieldFarmingRewardsClaimApiArg = {
  /** Claim accrued rewards */
  yieldFarmingRewardsClaim: YieldFarmingRewardsClaim;
};
export type CreateOptionApiResponse =
  /** status 200 Successful operation */ UnsignedTransaction;
export type CreateOptionApiArg = {
  /** Create Option */
  createOption: CreateOption;
};
export type RetrieveOptionApiResponse =
  /** status 200 Successful operation */ UnsignedTransaction;
export type RetrieveOptionApiArg = {
  /** Retrieve Option */
  retrieveOption: RetrieveOption;
};
export type ExecuteOptionApiResponse =
  /** status 200 Successful operation */ UnsignedTransaction;
export type ExecuteOptionApiArg = {
  /** Execute Option */
  executeOption: ExecuteOption;
};
export type TermsAcceptApiResponse = /** status 200 Successful operation */ void;
export type TermsAcceptApiArg = {
  /** userId and terms and conditions that user is accepting. */
  termsAccept: TermsAccept;
};
export type GetTwoWayOrdersApiResponse =
  /** status 200 Successful operation */ TwoWayOrderList;
export type GetTwoWayOrdersApiArg = void;
export type GetTwoWayOrderByIdApiResponse =
  /** status 200 Successful operation */ TwoWayOrderResult;
export type GetTwoWayOrderByIdApiArg = {
  /** ID of the two-way order */
  orderId: string;
};
export type PlaceTwoWayOrderApiResponse =
  /** status 200 Successful operation */ UnsignedTransaction;
export type PlaceTwoWayOrderApiArg = {
  twoWayOrderPlace: TwoWayOrderPlace;
};
export type FillTwoWayOrderApiResponse =
  /** status 200 Successful operation */ UnsignedTransaction;
export type FillTwoWayOrderApiArg = {
  twoWayOrderFill: TwoWayOrderFill;
};
export type GetTwoWayOrderHistoryApiResponse =
  /** status 200 Successful operation */ TwoWayOrderHistory;
export type GetTwoWayOrderHistoryApiArg = {
  /** ID of the two-way order */
  orderId: string;
};
export type GetSlvBalanceApiResponse = /** status 200 Successful operation */ SlvBalance;
export type GetSlvBalanceApiArg = void;
export type UnsignedTransaction = {
  transactionId: string;
  transactionPayload: string;
};
export type AbstractError = {
  /** Code representing type of error. */
  errorCode: string;
  /** Human readable error message. */
  message?: string;
};
export type GeneralError = AbstractError;
export type TwoWayOrderCancel = {
  walletAddress: string;
  walletRewardAddresses?: string[];
  walletUsedAddresses: string[];
  walletUnusedAddresses: string[];
  collateralUtxo: string[];
  utxoReference: string;
};
export type TwoWayOrderCancelRequest = {
  walletAddress: string;
  walletRewardAddresses?: string[];
  walletUsedAddresses: string[];
  walletUnusedAddresses: string[];
  collateralUtxo: string[];
  utxoReference: string;
};
export type CirculatingSupply = {
  circulatingSupply: string;
};
export type OrderSaleProjectReference = {
  orderSaleProjectId: string;
};
export type BaseAssetAmount = {
  /** Indivisible asset value */
  baseAssetAmount: string;
};
export type QuoteAssetAmount = {
  /** Indivisible asset value */
  quoteAssetAmount: string;
};
export type OrderSaleProjectRoundStatus = 'UPCOMING' | 'ACTIVE' | 'CLOSED';
export type AssetReference = {
  assetId: string;
};
export type Asset = AssetReference & {
  assetId: string;
  policyId: string;
  assetName: string;
  shortName: string;
  longName: string;
  iconUrl: string;
  decimalPrecision: number;
  referenceAssetId?: string;
  referenceAssetAmount?: string;
  enabled?: boolean;
};
export type AbstractOrderSaleProject = OrderSaleProjectReference &
  BaseAssetAmount &
  QuoteAssetAmount & {
    name: string;
    status: OrderSaleProjectRoundStatus;
    imageLogoUrl: string;
    longDescription: string;
    shortDescription: string;
    vestingPeriod: string;
    distributionDate: string;
    distributionMethod: string;
    baseAsset: Asset;
    quoteAsset: Asset;
    /** Total to asset allocated. */
    baseAssetAllocationAmount: string;
    baseAssetTotalTokenSupplyAmount?: string;
    /** All project's rounds raised amount in from asset. The sum of raised assets considering all closed and active rounds. */
    roundsQuoteAssetRoundsRaisedAmount: string;
    /** All project's rounds allocation amount in to asset, The sum of all planned asset allocation considering all closed, active and upcoming rounds */
    roundsBaseAssetAllocationAmount: string;
    /** this should indicate that token distribution has been completed for an user */
    distributionIsCompleted: boolean;
    mediaEmail?: string;
    websiteUrl?: string;
    pitchDeckUrl?: string;
    whitePaperUrl?: string;
    mediaDiscordUrl?: string;
    mediaMediumUrl?: string;
    mediaTwitterUrl?: string;
    mediaTelegramUrl?: string;
    privacyPolicyUrl?: string;
    mediaYoutubeUrl?: string;
  };
export type OrderSaleProjectRoundReference = {
  roundId: string;
};
export type BaseAssetReference = {
  baseAssetId: string;
};
export type QuoteAssetReference = {
  quoteAssetId: string;
};
export type OrderSaleProjectRound = OrderSaleProjectRoundReference &
  BaseAssetReference &
  BaseAssetAmount &
  QuoteAssetReference &
  QuoteAssetAmount & {
    orderSaleProjectId: string;
    number: number;
    shortName: string;
    startDate: string;
    endDate: string;
    status: OrderSaleProjectRoundStatus;
    /** indicates a round is closed. it could be also because business decision to close a round before it's natural end */
    isClosed: boolean;
    /** indicates a round has met or exceeded its allocation amount (quoteAssetRaisedAmount >= baseAssetAllocationAmount) */
    isSoldOut: boolean;
    /** order minimum allocation amount */
    orderBaseAssetMinAllocation: string;
    /** order maximum allocation amount */
    orderBaseAssetMaxAllocation: string;
    /** summation of all order quantity sold in a project sale round */
    quoteAssetRaisedAmount: string;
    /** summation of all asset quantity sent to buyer wallet for a given project sale round */
    baseAssetSubmittedAmount: string;
    baseAssetAllocationAmount: string;
    eligibilityDescription?: string | null;
  };
export type ProjectTeamMemberReference = {
  teamMemberId: string;
};
export type ProjectTeamMember = ProjectTeamMemberReference & {
  name: string;
  role: string;
  imageUrl: string;
  twitterUrl?: string;
  telegramUrl?: string;
  linkedinUrl?: string;
  facebookUrl?: string;
};
export type KeyFeature = {
  title: string;
  description: string;
};
export type Technology = {
  iconUrl: string;
  title: string;
  subtitle: string;
  description: string;
};
export type TokenomicsItem = {
  title: string;
  amount: number;
};
export type OrderSaleProjectRoadmapItem = {
  title: string;
  roadmapObjectives: string[];
  isChecked: boolean;
};
export type OrderSaleProject = AbstractOrderSaleProject & {
  status: OrderSaleProjectRoundStatus;
  statusRoundId: string;
  isBuyForbidden: boolean;
  isBuyForbiddenReason?: string;
  rounds: OrderSaleProjectRound[];
  teamMembers?: ProjectTeamMember[] | null;
  fundingMethod?: string | null;
  lockupPeriod?: string | null;
  projectReportUrl?: string | null;
  tokenUtility?: {
    description?: string | null;
    items?: string[] | null;
  } | null;
  keyFeatures?: KeyFeature[] | null;
  technologies?: Technology[] | null;
  mediaYoutubeUrl?: string | null;
  tokenomics?: TokenomicsItem[] | null;
  roadmapItems?: OrderSaleProjectRoadmapItem[] | null;
};
export type OrderSaleProjectResults = {
  count: number;
  next?: string;
  previous?: string;
  results: OrderSaleProject[];
};
export type EntityCreated = {
  created: string;
};
export type EntityUpdated = {
  updated: string;
};
export type EntityDates = EntityCreated & EntityUpdated;
export type OrderReference = {
  orderId: string;
};
export type OrderStatus = string;
export type Transaction = {
  transactionId: string;
  transactionUrl: string;
};
export type TransactionType = string;
export type OrderTransaction = Transaction & {
  transactionDate?: string;
  transactionHash?: string;
  transactionType: TransactionType;
  isTransactionConfirmed: boolean;
};
export type SaleOrderBase = EntityDates &
  OrderReference &
  BaseAssetReference &
  BaseAssetAmount &
  QuoteAssetReference &
  QuoteAssetAmount & {
    status: OrderStatus;
    statusTransactionId: string;
    transactions: OrderTransaction[];
  };
export type SaleOrderData = OrderSaleProjectRoundReference &
  BaseAssetReference &
  BaseAssetAmount;
export type SaleOrderStatus = OrderStatus & ('OPEN' | 'FILL' | 'CANCEL' | 'PARTIAL_FILL');
export type SaleOrderTransactionType = TransactionType & ('OPEN' | 'FILL' | 'CANCEL');
export type SaleOrderTransaction = OrderTransaction & {
  transactionType: SaleOrderTransactionType;
};
export type SaleOrder = SaleOrderBase &
  SaleOrderData & {
    baseAssetAmountFilled: string;
    status: SaleOrderStatus;
    isStatusPending: boolean;
    transactions: SaleOrderTransaction[];
  };
export type OrderSalePortfolioProject = OrderSaleProject & {
  orders: SaleOrder[];
};
export type OrderSalePortfolioResults = {
  count: number;
  next?: string;
  previous?: string;
  results: OrderSalePortfolioProject[];
};
export type ToAssetReference = {
  toAssetId: string;
};
export type ToAssetAmount = {
  /** Indivisible asset value */
  toAssetAmount: string;
};
export type FromAssetReference = {
  fromAssetId: string;
};
export type FromAssetAmount = {
  /** Indivisible asset value */
  fromAssetAmount: string;
};
export type Order = EntityDates &
  OrderReference &
  ToAssetReference &
  ToAssetAmount &
  FromAssetReference &
  FromAssetAmount & {
    status: OrderStatus;
    statusTransactionId: string;
    transactions: OrderTransaction[];
  };
export type FillFromAssetCount = {
  /** Maximum number of partial fill orders */
  fillFromAssetCount?: string;
};
export type EffectiveDates = {
  effectiveFromDate?: string;
  effectiveUntilDate?: string;
};
export type SwapOrderType = 'LIMIT';
export type SwapOrderFillType = 'FILL_DIRECT' | 'FILL_BEST_AVAILABLE';
export type SwapOrderData = ToAssetReference &
  ToAssetAmount &
  FromAssetReference &
  FromAssetAmount &
  FillFromAssetCount &
  EffectiveDates & {
    orderType: SwapOrderType | SwapOrderFillType;
  };
export type SwapOrderAssetPair = {
  toAsset: Asset;
  fromAsset: Asset;
};
export type MinFillFromAssetAmount = {
  /** Min from asset amount required to fill */
  minFillFromAssetAmount?: string;
};
export type MinFillToAssetAmount = {
  /** Min to asset amount required to fill */
  minFillToAssetAmount?: string;
};
export type SwapOrderAmountFilled = {
  toAssetAmountFilled: string;
  fromAssetAmountFilled: string;
};
export type SwapOrderAmountRemaining = {
  toAssetAmountRemaining: string;
  fromAssetAmountRemaining: string;
};
export type Deposit = {
  depositAmount?: string;
};
export type TransactionFee = {
  transactionFeeAmount?: string;
};
export type SwapOrderMakerFees = TransactionFee & {
  makerLovelaceFlatFeeAmount?: string;
  makerFromAssetFeeAmount?: string;
  makerFromAssetFeePercent?: string;
};
export type SwapOrderTakerFees = TransactionFee & {
  takerLovelaceFlatFeeAmount?: string;
  takerFromAssetFeeAmount?: string;
  takerFromAssetFeePercent?: string;
};
export type TransactionTotalFees = {
  transactionTotalFeesAmount: string;
};
export type SwapOrderStatus = OrderStatus &
  (
    | 'PENDING'
    | 'OPEN'
    | 'FAILED'
    | 'FILLED'
    | 'CANCELLED'
    | 'SCHEDULED'
    | 'EXPIRED'
    | 'OPEN_INIT'
    | 'OPEN_SUBMIT'
    | 'OPEN_ONCHAIN'
    | 'FILL_INIT'
    | 'FILL_SUBMIT'
    | 'FILL_ONCHAIN'
  );
export type SwapOrderTransactionType = TransactionType &
  ('OPEN' | 'FILL' | 'CANCEL' | 'PARTIAL_FILL');
export type SwapOrderTransaction = OrderTransaction & {
  toAssetAmountFilled?: string | null;
  fromAssetAmountFilled?: string | null;
  transactionType: SwapOrderTransactionType;
};
export type SwapOrder = Order &
  SwapOrderData &
  SwapOrderAssetPair &
  MinFillFromAssetAmount &
  MinFillToAssetAmount &
  SwapOrderAmountFilled &
  SwapOrderAmountRemaining &
  Deposit &
  SwapOrderMakerFees &
  SwapOrderTakerFees &
  TransactionFee &
  TransactionTotalFees & {
    status: SwapOrderStatus;
    transactions: SwapOrderTransaction[];
  };
export type SwapOrderResults = {
  count: number;
  next?: string;
  previous?: string;
  results: SwapOrder[];
};
export type NetworkErrorCode = 'NETWORK__TIMEOUT';
export type TransactionErrorCode = 'TRANSACTION__NO_SUITABLE_COLLATERAL';
export type OrderErrorCode =
  | 'INVALID_ORDER__INSUFFICIENT_BALANCE'
  | 'INVALID_ORDER__ORDER_NOT_ACTIVE_OR_EXPIRED'
  | 'ORDER__BEST_AVAILABLE_ORDER_NOT_FOUND'
  | 'INVALID_ORDER__UTXO_CONSUMED';
export type OrderError = {
  errorCode: NetworkErrorCode | TransactionErrorCode | OrderErrorCode;
  /** Human readable error message. */
  message?: string;
};
export type SwapOrderSortByOptions =
  | '+toAssetAmount'
  | '-toAssetAmount'
  | '+fromAssetAmount'
  | '-fromAssetAmount'
  | '+serviceFee'
  | '-serviceFee'
  | '+created'
  | '-created';
export type MarketOrderSwapItem = {
  marketOrderSwap: SwapOrder;
  marketOrderSwapFillAmount: string;
};
export type MarketOrderSwapResults = {
  displayUnitPrice: string;
  displayUnitPriceAssetId: string;
  marketOrderSwapFilledAmount: string;
  marketOrderSwapTotalFillAmount: string;
  marketOrderFillAmountAssetId: string;
  marketOrderSwaps: MarketOrderSwapItem[];
};
export type BestAvailableSwapOrderResults = {
  marketOrderSwapResults: MarketOrderSwapResults | null;
  alternativeMarketOrderSwapResults: MarketOrderSwapResults | null;
};
export type SwapOrderMakerDepositFees = Deposit & SwapOrderMakerFees;
export type SwapOrderMakerTotalFeesDeposit = SwapOrderMakerDepositFees &
  TransactionTotalFees;
export type WalletAddress = {
  walletAddress: string;
};
export type WalletAccount = WalletAddress & {
  walletRewardAddresses?: string[];
  walletUsedAddresses: string[];
  walletUnusedAddresses: string[];
  collateralUtxo: string[];
};
export type OpenSwapOrder = WalletAccount & SwapOrderData;
export type SaleOrderErrorCode =
  | 'REQUEST_VALIDATION__MISSING_ROUND_ID'
  | 'INVALID_ORDER__TOO_EARLY_PLACE'
  | 'INVALID_ORDER__TOO_LATE_PLACE'
  | 'REQUEST_VALIDATION__MISSING_ORDER_ID'
  | 'INVALID_ORDER__INVALID_USER';
export type SaleOrderError = {
  errorCode:
    | NetworkErrorCode
    | TransactionErrorCode
    | OrderErrorCode
    | SaleOrderErrorCode;
  /** Human readable error message. */
  message?: string;
};
export type SaleOrderTotalFeesDeposit = {
  transactionFeeAmount?: string;
  transactionFeeDepositAmount?: string;
  transactionFeeServiceAmount?: string;
  transactionFeeServicePercent?: string;
  transactionTotalCostsAmount?: string;
};
export type OpenSaleOrder = SaleOrderData & WalletAccount;
export type UnsignedSaleOrderData = SaleOrderData &
  QuoteAssetAmount &
  QuoteAssetReference &
  UnsignedTransaction;
export type UnsignedSaleOrder = OrderReference & UnsignedSaleOrderData;
export type CancelSwapOrder = WalletAccount;
export type FillSwapOrder = ToAssetAmount & {
  orderReference: OrderReference;
};
export type FillSwapOrders = WalletAccount & {
  fillSwapOrders: FillSwapOrder[];
  orderFillType: SwapOrderFillType;
};
export type SwapOrderTakerTotalFees = SwapOrderTakerFees & TransactionTotalFees;
export type CancelSaleOrder = WalletAccount;
export type SmartVaultReference = {
  smartVaultId: string;
};
export type SmartVaultStrategy = {
  created: string;
  smartVaultStrategyId: string;
  name: string;
  description: string;
  configJsonSchema: string;
  numberOfAssetsSupported: number;
};
export type SmartVaultAssetDetailed = {
  assetId: string;
  asset?: Asset;
  assetAmount: string;
};
export type SmartVault = SmartVaultReference & {
  status: 'PENDING' | 'OPEN' | 'CLOSED' | 'FAILED';
  stakeKeyHashRef: string;
  smartVaultStrategy: SmartVaultStrategy;
  depositedAssets: SmartVaultAssetDetailed[];
  withdrawableAssets: SmartVaultAssetDetailed[];
  created: string;
};
export type SmartVaultListResult = {
  count: number;
  next?: string;
  previous?: string;
  results: SmartVault[];
};
export type SmartVaultResult = SmartVault;
export type SmartVaultId = string;
export type SmartVaultOperationReference = {
  smartVaultOperationId: string;
};
export type SmartVaultOperation = SmartVaultReference &
  SmartVaultOperationReference & {
    operationType: 'DEPOSIT' | 'WITHDRAW';
    status: 'PENDING' | 'CONFIRMED' | 'FAILED';
    creatorStakeKeyHash: string;
    transactionHash: string;
    transactionDate?: string;
    assets: SmartVaultAssetDetailed[];
  };
export type SmartVaultOperationListResult = {
  count: number;
  next?: string;
  previous?: string;
  results: SmartVaultOperation[];
};
export type SmartVaultStrategyListResult = SmartVaultStrategy[];
export type SmartVaultErrorCode =
  | 'SMART_VAULT__REQUEST_VALIDATION__HAS_DEPOSITED_ASSETS'
  | 'INVALID_ORDER__UTXO_CONSUMED';
export type SmartVaultError = {
  errorCode: NetworkErrorCode | TransactionErrorCode | SmartVaultErrorCode;
  /** Human readable error message. */
  message?: string;
};
export type SmartVaultAssetTransfer = {
  assetId: string;
  assetAmount: string;
};
export type SmartVaultOpenData = {
  smartVaultStrategyId: string;
  smartVaultStrategyConfigJson: string;
  depositAssets: SmartVaultAssetTransfer[];
};
export type SmartVaultOpen = WalletAccount & SmartVaultOpenData;
export type SmartVaultDepositData = SmartVaultReference & {
  depositAssets: SmartVaultAssetTransfer[];
};
export type SmartVaultDeposit = WalletAccount & SmartVaultDepositData;
export type SmartVaultWithdrawEstimateResult = {
  withdrawableAssets: SmartVaultAssetDetailed[];
};
export type SmartVaultWithdrawEstimateData = SmartVaultReference;
export type SmartVaultWithdrawEstimate = WalletAccount & SmartVaultWithdrawEstimateData;
export type SmartVaultWithdrawData = SmartVaultReference & {
  withdrawAssets: SmartVaultAssetTransfer[];
};
export type SmartVaultWithdraw = WalletAccount & SmartVaultWithdrawData;
export type SmartVaultCloseData = SmartVaultReference;
export type SmartVaultClose = WalletAccount & SmartVaultCloseData;
export type TradingPair = {
  tradingPairId: string;
  baseAsset: Asset;
  quoteAsset: Asset;
};
export type TradingPairsResults = {
  results: TradingPair[];
};
export type LiquidityPool = {
  liquidityPoolId?: string;
  assets?: Asset[];
};
export type LiquidityPoolsResults = {
  count: number;
  next?: string;
  previous?: string;
  results: LiquidityPool[];
};
export type LiquidityPoolReference = {
  liquidityPoolId: string;
};
export type LiquidityPositionReference = {
  LiquidityPositionId: string;
};
export type WalletStakeKeyHash = {
  walletStakeKeyHash: string;
};
export type LiquidityPositionData = {
  toAssetId?: string;
  toInitialAmount?: string;
  fromAssetId?: string;
  fromInitialAmount?: string;
  /** Price at which liquidity is available to orders */
  fromPrice?: string;
  minTradePriceLimit?: string;
};
export type LiquidityPositionStatus = 'OPEN' | 'CLOSE';
export type LiquidityPositionTransactionType = TransactionType & ('OPEN' | 'CLOSE');
export type LiquidityPositionTransaction = OrderTransaction & {
  transactionType: LiquidityPositionTransactionType;
};
export type LiquidityPosition = LiquidityPositionReference &
  WalletStakeKeyHash &
  LiquidityPositionData & {
    liquidityPoolId: string;
    toRewardAmount: string;
    fromRewardAmount: string;
    status: LiquidityPositionStatus;
    created: string;
    updated: string;
    usedCount?: number;
    transactions: LiquidityPositionTransaction[];
  };
export type UnsignedLiquidityPosition = LiquidityPosition & UnsignedTransaction;
export type OpenLiquidityPosition = WalletAccount & LiquidityPositionData;
export type LiquidityPositionClose = WalletAccount;
export type TransactionSubmitSuccessResponse = {
  status: 'SUBMITTED';
  transaction: Transaction;
};
export type TransactionSubmitAcceptedResponse = {
  status: 'QUEUED' | 'REJECTED';
};
export type SignedTransaction = {
  transactionId: string;
  transactionPayload: string;
  transactionSignature: string;
  eventType:
    | 'orderSwapEvent'
    | 'orderSaleEvent'
    | 'twoWayOrderEvent'
    | 'stakeVaultEvent'
    | 'yieldFarmingEvent'
    | 'optionEvent'
    | 'smartVaultEvent';
};
export type OrderBookEntryType = 'SwapOrder';
export type OrderBookEntry = {
  orderBookEntryType: OrderBookEntryType;
  order: SwapOrder;
};
export type OrderBook = BaseAssetReference &
  QuoteAssetReference & {
    marketPrice: string;
    askOrderBookEntries: OrderBookEntry[];
    bidOrderBookEntries: OrderBookEntry[];
  };
export type BaseQuoteAssetPair = {
  baseAsset: Asset;
  quoteAsset: Asset;
};
export type MarketAggPrice = {
  assetPair: BaseQuoteAssetPair;
  data: {
    timestamp?: number;
    price?: number;
  }[];
};
export type MarketKline = {
  quoteAssetId: string;
  baseAssetId: string;
  priceAssetId: string;
  data: {
    open: number;
    high: number;
    low: number;
    close: number;
    time: string;
  }[];
};
export type MarketMakerMetricsBinnedOrders = WalletStakeKeyHash & {
  assetPair: {
    assetOne: Asset;
    assetTwo: Asset;
  };
  priceAssetId: string;
  data: {
    timestamp: number;
    /** Accumulated ROI from start of time window up until this data point. Represented as a fraction of 1, e.g., 0.15 for 15%. */
    roiPercent?: number;
    /** Accumulated Earned asset amount from start of time window up until this data point. Represented as an indivisible asset amount. */
    earnedPriceAssetAmount?: string;
    /** Market price sourced externally. Aimed to be as representative as possible of the price of the non-price asset. */
    price?: number;
    assetOneAmountBought?: string;
    assetTwoAmountBought?: string;
    assetOneAmountNetPosition?: string;
    assetTwoAmountNetPosition?: string;
    assetOneBoughtCount?: string;
    assetTwoBoughtCount?: string;
    openTransactionFeeAmount?: string;
    cancelTransactionFeeAmount?: string;
    buyMakerFromAssetFeeAmount?: string;
    sellMakerFromAssetFeeAmount?: string;
    makerAdaFlatFeeAmount?: string;
  }[];
};
export type MarketOrderBookItem = {
  orderId?: string;
  baseAssetId?: string;
  baseAssetAmount?: string;
  quoteAssetId?: string;
  quoteAssetAmount?: string;
  type?: 'ASK' | 'BID';
};
export type MarketOrderBook = {
  time?: number;
  currentPrice?: string;
  orderBook?: MarketOrderBookItem[];
};
export type LiquidityDistributionItem = {
  assetId?: string;
  currentAmount?: string;
  price?: string;
};
export type MarketLiquidityDistribution = {
  time?: number;
  liquidityDistribution?: LiquidityDistributionItem[];
};
export type MarketVolume = {
  time?: number;
  referenceAssetVolumeAmount?: string;
};
export type MarketTradeVolume = {
  referenceAssetId?: string;
  series?: MarketVolume[];
};
export type MarketTotalVolumeLocked = {
  referenceAssetId?: string;
  series?: MarketVolume[];
};
export type TradingWalletReference = {
  tradingWalletId: string;
};
export type TradingWalletStakeKeyHash = {
  tradingWalletStakeKeyHash: string;
};
export type StakeKeyUrl = {
  stakeKeyUrl: string | null;
};
export type TradingWallet = TradingWalletReference &
  TradingWalletStakeKeyHash &
  StakeKeyUrl & {
    assetOne: Asset;
    assetTwo: Asset;
    startDate?: string;
    /** ROI represented as a fraction of 1, e.g., 0.15 for 15% */
    roiPercent: number | null;
    /** Win rate represented as a fraction of 1, e.g., 0.15 for 15% */
    winRatePercent: number | null;
    /** The window interval used when populating profitabilityHistory array */
    profitabilityWindowInterval: ('1d' | '1w' | '1mo' | '3mo' | '6mo' | '1y') | null;
    profitabilityHistory: {
      timestamp: number;
      /** ROI represented as a fraction of 1, e.g., 0.15 for 15% */
      roiPercent?: number;
    }[];
    earnedAdaAssetAmount: string | null;
    tradesCount: string;
  };
export type TradingWalletsResult = {
  count: number;
  next?: string;
  previous?: string;
  results: TradingWallet[];
};
export type TradingWalletErrorCode =
  | 'INVALID_TRADING_WALLET__INCORRECT_STAKE_KEY_HASH_FORMAT'
  | 'INVALID_TRADING_WALLET__ALREADY_EXISTS';
export type TradingWalletError = {
  errorCode: TradingWalletErrorCode | NetworkErrorCode;
  /** Human readable error message. */
  message?: string;
};
export type TradingWalletSortByOptions =
  | '+created'
  | '-created'
  | '+roiPercent'
  | '-roiPercent'
  | '+winRatePercent'
  | '-winRatePercent'
  | '+earnedAdaAssetAmount'
  | '-earnedAdaAssetAmount';
export type TradingWalletResult = TradingWallet;
export type TradingWalletId = string;
export type TradingWalletRegisterResult = TradingWalletReference;
export type AssetOneReference = {
  assetOneId: string;
};
export type AssetTwoReference = {
  assetTwoId: string;
};
export type TradingWalletData = AssetOneReference &
  AssetTwoReference &
  TradingWalletStakeKeyHash;
export type RegisterTradingWallet = TradingWalletData;
export type UserKyc = {
  kycAccessToken?: string;
  isKycRequired: boolean;
  isKycRequiredReason?: string;
};
export type UserTerms = {
  termsUrl: string;
  termsVersion: string;
  isTermsAcceptanceRequired: boolean;
};
export type UserConnectResponse = UserKyc &
  UserTerms & {
    userId?: string;
  };
export type ConnectErrorCode = 'USER_CONNECT__INVALID_USER';
export type ConnectError = {
  errorCode: ConnectErrorCode;
  /** Human readable error message. */
  message?: string;
};
export type UserType = 'INDIVIDUAL' | 'COMPANY';
export type UserConnect = WalletStakeKeyHash & {
  userId?: string;
  userType?: UserType;
  walletType: string;
};
export type AbstractKycEvent = object;
export type KycSumsubReviewResult = {
  reviewAnswer: string;
};
export type KycSumsubEvent = AbstractKycEvent & {
  type: string;
  clientId: string;
  createdAt: string;
  levelName?: string;
  applicantId: string;
  inspectionId: string;
  reviewStatus: string;
  reviewResult?: KycSumsubReviewResult;
  applicantType?: string;
  correlationId: string;
  externalUserId: string;
  sandboxMode?: boolean;
};
export type StakingProjectReference = {
  stakingProjectId: string;
};
export type StakeVaultLockDuration =
  | 'FLEX'
  | 'MONTHS_1'
  | 'MONTHS_3'
  | 'MONTHS_6'
  | 'MONTHS_9'
  | 'MONTHS_12';
export type StakingProject = StakingProjectReference & {
  stakingAsset: Asset;
  lockDurationOptions: StakeVaultLockDuration[];
  imageLogoUrl: string;
};
export type StakingProjectsResult = {
  count: number;
  next?: string;
  previous?: string;
  results: StakingProject[];
};
export type StakingNftReference = {
  type: string;
  subType: string;
};
export type StakingNft = StakingNftReference & {
  policyId: string;
  assetName: string;
  stackableWith: string[];
  imageUrl: string;
  name: string;
  apyBoost?: string;
  vestingBoost?: string;
};
export type StakingProjectNftsResult = {
  count: number;
  next?: string;
  previous?: string;
  results: StakingNft[];
};
export type WalletBalance = {
  walletBalance: string;
};
export type StakingProjectNftsRequest = WalletStakeKeyHash & WalletBalance;
export type StakeVaultReference = {
  stakeVaultId: string;
};
export type StakeVaultRewardState = {
  lockDuration: StakeVaultLockDuration;
  totalApy?: string;
  nftsApy?: string;
  revenueAmplifier?: string;
};
export type StakeVault = StakeVaultReference & {
  inactiveRewardState?: StakeVaultRewardState;
  activeRewardState?: StakeVaultRewardState;
  unlocksAt?: string;
  stakedAsset: Asset;
  stakedAssetAmount: string;
  stakedStakingNfts: StakingNft[];
  transactionUrl?: string;
  isUnstaked: boolean;
  isUnstakingEnabled: boolean;
};
export type StakeVaultsResult = {
  count: number;
  next?: string;
  previous?: string;
  results: StakeVault[];
};
export type StakeVaultNftUsageReport = {
  secondsRemaining: number | null;
};
export type StakeVaultData = StakingProjectReference & {
  stakedAssetAmount: string;
  lockDuration: StakeVaultLockDuration;
  stakingNfts: {
    type: string;
    subType: string;
    assetName: string;
    policyId: string;
  }[];
};
export type UnsignedStakeVaultData = StakeVaultData & UnsignedTransaction;
export type TransactionUrl = {
  transactionUrl: string;
};
export type UnsignedStakeVault = StakeVaultReference &
  UnsignedStakeVaultData &
  TransactionUrl & {
    unlocksAt: string;
  };
export type StakeVaultErrorCode =
  | 'INVALID_STAKE_VAULT__NFT_COMBINATION'
  | 'INVALID_STAKE_VAULT__VESTING_NFTS_NOT_ALLOWED'
  | 'INVALID_STAKE_VAULT__INSUFFICIENT_BALANCE'
  | 'INVALID_STAKE_VAULT__WALLET_ADDRESS_MISSING_STAKE_PART'
  | 'INVALID_STAKE_VAULT__INVALID_LOCK_DURATION'
  | 'INVALID_STAKE_VAULT__STAKED_ASSET_TOTAL_AMOUNT_LIMIT_REACHED'
  | 'INVALID_STAKE_VAULT__STAKED_ASSET_AMOUNT_NOT_NUMBER';
export type StakeVaultError = {
  errorCode: TransactionErrorCode | StakeVaultErrorCode;
  /** Human readable error message. */
  message?: string;
};
export type CreateStakeVault = WalletAccount & StakeVaultData;
export type UnstakeStakeVaultData = StakeVaultReference;
export type UnsignedUnstakeStakeVaultData = UnstakeStakeVaultData & UnsignedTransaction;
export type UnsignedUnstakeStakeVault = UnsignedUnstakeStakeVaultData & TransactionUrl;
export type UnstakeStakeVault = WalletAccount & UnstakeStakeVaultData;
export type StakeVaultCreateRewardsEstimate = {
  totalAssetAmountReward?: string;
  totalApyBoost?: string;
  totalRevenueAmplifier?: string;
  nftsApyBoost?: string;
  nftsApyDisclaimer?: string;
};
export type StakeVaultCreateRewardsEstimateResponse = StakeVaultCreateRewardsEstimate;
export type YieldFarmingRewardAsset = {
  assetAmount: string;
  asset: Asset;
};
export type YieldFarmingRewardsGroup = {
  assets: YieldFarmingRewardAsset[];
  groupName: string;
};
export type YieldFarmingRewardsResult = {
  rewardsClaimLovelaceServiceFee: string;
  rewardsGroups: YieldFarmingRewardsGroup[];
};
export type YieldFarmingRewardsClaim = WalletAccount;
export type CreateOptionData = {
  endDate: string;
  baseAssetId: string;
  quoteAssetId: string;
  baseAssetAmount: string;
  baseAssetShortName: string;
  quoteAssetShortName: string;
  baseAssetPrice: string;
};
export type CreateOption = WalletAccount & CreateOptionData;
export type RetrieveOption = WalletAccount & {
  optionAmount: string;
  optionUtxoRef: string;
};
export type ExecuteOption = WalletAccount & {
  optionAmount: string;
  optionUtxoRef: string;
};
export type TermsAccept = {
  acceptedTermsVersion: string;
};
export type TwoWayOrderItem = {
  twoWayOrderId: string;
  toAssetId: string;
  fromAssetId: string;
  toAssetAmount: string;
  fromAssetAmount: string;
  toAssetAmountTotalRemaining: string;
  fromAssetAmountTotalRemaining: string;
  toAssetAmountTotalFilled: string;
  fromAssetAmountTotalFilled: string;
  price: number;
  priceNumerator?: string | null;
  priceDenominator?: string | null;
  orderStatus?: string | null;
  mintAssetId?: string | null;
  depositAmount?: string | null;
  makerLovelaceFlatFeeAmount?: string | null;
  makerFromAssetFeePercent?: number | null;
  makerFromAssetFeeAmount?: string | null;
  takerLovelaceFlatFeeAmount?: string | null;
  takerFromAssetFeePercent?: number | null;
  takerFromAssetFeeAmount?: string | null;
  utxoReferenceTransactionHash?: string | null;
  utxoReferenceIndex?: number | null;
  effectiveFromDate?: string | null;
  effectiveUntilDate?: string | null;
  partialFillCount: number;
  orderDate: string;
  transactionDateOpen?: string | null;
  transactionDateFill?: string | null;
  transactionDateCancel?: string | null;
  created: string;
  updated: string;
  toAssetNetReceived: string;
  pnlToAbs: string;
  pnlToPct: number;
};
export type TwoWayOrderList = TwoWayOrderItem[];
export type TwoWayOrderResult = {
  twoWayOrderId: string;
  toAssetId: string;
  fromAssetId: string;
  toAssetAmount: string;
  fromAssetAmount: string;
  toAssetAmountTotalRemaining: string;
  fromAssetAmountTotalRemaining: string;
  toAssetAmountTotalFilled: string;
  fromAssetAmountTotalFilled: string;
  price: number;
  orderStatus?: string | null;
  partialFillCount: number;
  created: string;
  updated: string;
  toAssetNetReceived: string;
  pnlToAbs: string;
  pnlToPct: number;
};
export type TwoWayOrderPlace = {
  walletAddress: string;
  collateralUtxo: string[];
  walletRewardAddresses?: string[];
  walletUnusedAddresses: string[];
  walletUsedAddresses: string[];
  toAssetId: string;
  toAssetName: string;
  toAssetPolicyId: string;
  toAssetAmount: string;
  fromAssetId: string;
  fromAssetName: string;
  fromAssetPolicyId: string;
  fromAssetAmount: string;
  effectiveFromDate?: string;
  effectiveUntilDate?: string;
};
export type TwoWayOrderFill = {
  walletAddress: string;
  collateralUtxo: string[];
  walletUnusedAddresses: string[];
  walletUsedAddresses: string[];
  utxoReference: string;
};
export type TwoWayOrderHistoryItem = {
  twoWayOrderActivityId: string;
  activityType: 'OPEN' | 'FILL' | 'CANCEL';
  txHash?: string | null;
  slot?: number | null;
  message?: string | null;
  created: string;
  fromFilled?: string | null;
  toFilled?: string | null;
  userReceiveTo?: string | null;
  userPayFrom?: string | null;
  feeTo?: string | null;
  feeFrom?: string | null;
  pnlToAbs?: string | null;
  pnlToPct?: number | null;
};
export type TwoWayOrderHistory = TwoWayOrderHistoryItem[];
export type SlvBalanceItem = {
  assetId: string;
  amount: string;
};
export type SlvBalance = SlvBalanceItem[];
export const {
  useCancelTwoWayOrderMutation,
  usePostTwoWayOrderCancelMutation,
  useGetAssetCirculatingSupplyQuery,
  useLazyGetAssetCirculatingSupplyQuery,
  useListOrderSaleProjectsQuery,
  useLazyListOrderSaleProjectsQuery,
  useGetOrderSaleProjectQuery,
  useLazyGetOrderSaleProjectQuery,
  useListOrderSalePortfolioProjectsQuery,
  useLazyListOrderSalePortfolioProjectsQuery,
  useListSwapOrdersQuery,
  useLazyListSwapOrdersQuery,
  useFindBestAvailableSwapOrdersQuery,
  useLazyFindBestAvailableSwapOrdersQuery,
  useGetSwapOrderQuery,
  useLazyGetSwapOrderQuery,
  useGetSwapOrderOpenFeeMutation,
  useGetSaleOrderQuery,
  useLazyGetSaleOrderQuery,
  useOpenSwapOrderMutation,
  useGetSaleOrderFeeMutation,
  useOpenSaleOrderMutation,
  useCancelSwapOrderMutation,
  useFillSwapOrdersMutation,
  useGetSwapOrderFillFeeMutation,
  useCancelSaleOrderMutation,
  useListSmartVaultsQuery,
  useLazyListSmartVaultsQuery,
  useGetSmartVaultQuery,
  useLazyGetSmartVaultQuery,
  useListSmartVaultOperationsQuery,
  useLazyListSmartVaultOperationsQuery,
  useListSmartVaultStrategiesQuery,
  useLazyListSmartVaultStrategiesQuery,
  useSmartVaultOpenMutation,
  useSmartVaultDepositMutation,
  useSmartVaultWithdrawEstimateMutation,
  useSmartVaultWithdrawMutation,
  useSmartVaultCloseMutation,
  useListTradingPairsQuery,
  useLazyListTradingPairsQuery,
  useListLiquidityPoolQuery,
  useLazyListLiquidityPoolQuery,
  useGetLiquidityPoolQuery,
  useLazyGetLiquidityPoolQuery,
  useGetLiquidityPoolByAssetPairQuery,
  useLazyGetLiquidityPoolByAssetPairQuery,
  useListLiquidityPositionsQuery,
  useLazyListLiquidityPositionsQuery,
  useGetLiquidityPositionQuery,
  useLazyGetLiquidityPositionQuery,
  useOpenLiquidityPositionMutation,
  useCloseLiquidityPositionMutation,
  useSubmitTransactionMutation,
  useGetOrderBookByAssetsQuery,
  useLazyGetOrderBookByAssetsQuery,
  useGetOrderSwapAggregatedPricesQuery,
  useLazyGetOrderSwapAggregatedPricesQuery,
  useGetOrderSwapKlineAggregatedPricesQuery,
  useLazyGetOrderSwapKlineAggregatedPricesQuery,
  useGetOrderSwapMarketMakerBinnedOrdersQuery,
  useLazyGetOrderSwapMarketMakerBinnedOrdersQuery,
  useListOrderBookQuery,
  useLazyListOrderBookQuery,
  useListLiquidityPositionsDistributionQuery,
  useLazyListLiquidityPositionsDistributionQuery,
  useListLiquidityPositionsTradeVolumeQuery,
  useLazyListLiquidityPositionsTradeVolumeQuery,
  useListLiquidityPositionsTvlQuery,
  useLazyListLiquidityPositionsTvlQuery,
  useListTradingWalletsQuery,
  useLazyListTradingWalletsQuery,
  useGetTradingWalletQuery,
  useLazyGetTradingWalletQuery,
  useRegisterTradingWalletMutation,
  useConnectWalletMutation,
  useCreateSumsubEventMutation,
  useListStakingProjectsQuery,
  useLazyListStakingProjectsQuery,
  useListStakingProjectNftsMutation,
  useListStakeVaultsQuery,
  useLazyListStakeVaultsQuery,
  useGetStakeVaultNftUsageReportQuery,
  useLazyGetStakeVaultNftUsageReportQuery,
  useCreateStakeVaultMutation,
  useUnstakeStakeVaultMutation,
  useGetStakeVaultCreateRewardsEstimateMutation,
  useYieldFarmingListRewardsQuery,
  useLazyYieldFarmingListRewardsQuery,
  useYieldFarmingRewardsClaimMutation,
  useCreateOptionMutation,
  useRetrieveOptionMutation,
  useExecuteOptionMutation,
  useTermsAcceptMutation,
  useGetTwoWayOrdersQuery,
  useLazyGetTwoWayOrdersQuery,
  useGetTwoWayOrderByIdQuery,
  useLazyGetTwoWayOrderByIdQuery,
  usePlaceTwoWayOrderMutation,
  useFillTwoWayOrderMutation,
  useGetTwoWayOrderHistoryQuery,
  useLazyGetTwoWayOrderHistoryQuery,
  useGetSlvBalanceQuery,
  useLazyGetSlvBalanceQuery,
} = injectedRtkApi;
