import {FastifySchema} from 'fastify';

import ouraSchemas from '~/implementation/fastify/schemas/oura';
import privateSchemas from '~/implementation/fastify/schemas/private';
import publicSchemas from '~/implementation/fastify/schemas/public';

export const CardanoOuraEventSchema: FastifySchema = {
  body: ouraSchemas.OuraEventBodySchema,
  response: {200: {}},
};

export const CirculatingSupplySchema: FastifySchema = {
  params: {assetId: {type: 'string'}},
  response: {200: publicSchemas.CirculatingSupplySchema},
};

export const OrderBookSchema: FastifySchema = {
  params: privateSchemas.AssetPairReferenceSchema,
  response: {200: publicSchemas.OrderBookSchema},
};

export const OrderSaleCancelSchema: FastifySchema = {
  body: publicSchemas.WalletAccountSchema,
  params: publicSchemas.OrderReferenceSchema,
  response: {200: publicSchemas.UnsignedSaleOrderSchema},
};

export const OrderSaleTotalFeesDepositSchema: FastifySchema = {
  body: publicSchemas.OpenSaleOrderSchema,
  response: {200: publicSchemas.TransactionFeeResponseSchema},
};

export const OrderSaleOpenSchema: FastifySchema = {
  body: publicSchemas.OpenSaleOrderSchema,
  response: {200: publicSchemas.UnsignedSaleOrderSchema},
};

export const OrderSalePortfolioSchema: FastifySchema = {
  querystring: privateSchemas.OrderSalePortfolioQuerySchema,
  response: {200: publicSchemas.OrderSalePortfolioResultsSchema},
};

export const OrderSaleProjectSchema: FastifySchema = {
  params: publicSchemas.OrderSaleProjectReferenceSchema,
  response: {200: publicSchemas.OrderSaleProjectResponseSchema},
};

export const OrderSaleProjectsSchema: FastifySchema = {
  querystring: privateSchemas.OrderSaleProjectQuerySchema,
  response: {200: publicSchemas.OrderSaleProjectResultsSchema},
};

export const OrderSaleProjectReplaceWhitelistSchema: FastifySchema = {
  params: publicSchemas.OrderSaleProjectRoundReferenceSchema,
  body: privateSchemas.ReplaceRoundWhitelistMultipartSchema,
  response: {200: {}},
};

export const OrderSwapOpenFeeSchema: FastifySchema = {
  body: publicSchemas.OpenOrderSwapSchema,
  response: {200: publicSchemas.OrderSwapMakerTotalFeesDepositSchema},
};

export const OrderSwapOpenSchema: FastifySchema = {
  body: publicSchemas.OpenOrderSwapSchema,
  response: {200: publicSchemas.UnsignedTransactionSchema},
};

export const OrderSwapFillFeeSchema: FastifySchema = {
  body: publicSchemas.FillOrderSwapsSchema,
  response: {200: publicSchemas.OrderSwapTakerTotalFeesSchema},
};

export const OrderSwapFillSchema: FastifySchema = {
  body: publicSchemas.FillOrderSwapsSchema,
  response: {200: publicSchemas.UnsignedTransactionSchema},
};

export const OrderSwapCancelSchema: FastifySchema = {
  body: publicSchemas.CancelOrderSwapSchema,
  response: {200: publicSchemas.UnsignedTransactionSchema},
};

export const OrderSwapListOrdersSchema: FastifySchema = {
  querystring: privateSchemas.OrderSwapQuerySchema,
  response: {200: publicSchemas.OrderSwapResultsSchema},
};

export const OrderSwapBestAvailableOrderSchema: FastifySchema = {
  querystring: privateSchemas.OrderSwapBestAvailableQuerySchema,
  response: {200: publicSchemas.BestAvailableSwapOrderResults},
};

export const TradingWalletListSchema: FastifySchema = {
  querystring: privateSchemas.TradingWalletListQuerySchema,
  response: {200: publicSchemas.TradingWalletsResultSchema},
};

export const TradingWalletSchema: FastifySchema = {
  params: privateSchemas.TradingWalletQuerySchema,
  response: {200: publicSchemas.TradingWalletResultSchema},
};

export const TradingWalletRegisterSchema: FastifySchema = {
  body: publicSchemas.RegisterTradingWalletSchema,
  response: {200: publicSchemas.TradingWalletRegisterResultSchema},
};

export const StakeVaultCreateSchema: FastifySchema = {
  body: publicSchemas.CreateStakeVaultSchema,
  response: {200: publicSchemas.UnsignedStakeVaultSchema},
};

export const StakeVaultUnstakeSchema: FastifySchema = {
  body: publicSchemas.UnstakeStakeVaultSchema,
  response: {200: publicSchemas.UnsignedUnstakeStakeVaultSchema},
};

export const StakeVaultCreateRewardsEstimateSchema: FastifySchema = {
  body: publicSchemas.CreateStakeVaultSchema,
  response: {200: publicSchemas.StakeVaultCreateRewardsEstimateResponse},
};

export const StakeVaultsSchema: FastifySchema = {
  querystring: privateSchemas.StakeVaultsQuerySchema,
  response: {200: publicSchemas.StakeVaultsResultSchema},
};

export const StakingProjectNftsSchema: FastifySchema = {
  body: privateSchemas.StakingProjectNftsQuerySchema,
  response: {200: publicSchemas.StakingProjectNftsResultSchema},
};

export const StakingProjectsSchema: FastifySchema = {
  querystring: privateSchemas.StakingProjectsQuerySchema,
  response: {200: publicSchemas.StakingProjectsResultSchema},
};

export const StakeVaultNftUsageReport: FastifySchema = {
  params: {assetId: {type: 'string'}},
  response: {200: publicSchemas.StakeVaultNftUsageReportSchema},
};

export const YieldFarmingRewardsQuerySchema: FastifySchema = {
  querystring: privateSchemas.YieldFarmingRewardsQuerySchema,
  response: {200: publicSchemas.YieldFarmingRewardsResult},
};

export const CreateOptionQuerySchema: FastifySchema = {
  body: publicSchemas.CreateOptionSchema,
  response: {200: publicSchemas.UnsignedTransactionSchema},
};

export const RetrieveOptionQuerySchema: FastifySchema = {
  body: publicSchemas.RetrieveOptionSchema,
  response: {200: publicSchemas.UnsignedTransactionSchema},
};

export const ExecuteOptionQuerySchema: FastifySchema = {
  body: publicSchemas.ExecuteOptionSchema,
  response: {200: publicSchemas.UnsignedTransactionSchema},
};

export const SmartVaultListSchema: FastifySchema = {
  querystring: privateSchemas.SmartVaultListQuerySchema,
  response: {200: publicSchemas.SmartVaultListResultSchema},
};

export const SmartVaultSchema: FastifySchema = {
  params: privateSchemas.SmartVaultQuerySchema,
  response: {200: publicSchemas.SmartVaultResultSchema},
};

export const SmartVaultOperationListSchema: FastifySchema = {
  params: privateSchemas.SmartVaultQuerySchema,
  querystring: privateSchemas.SmartVaultOperationListQuerySchema,
  response: {200: publicSchemas.SmartVaultOperationListResultSchema},
};

export const SmartVaultOpenSchema: FastifySchema = {
  body: publicSchemas.SmartVaultOpenSchema,
  response: {200: publicSchemas.UnsignedTransactionSchema},
};

export const SmartVaultDepositSchema: FastifySchema = {
  body: publicSchemas.SmartVaultDepositSchema,
  response: {200: publicSchemas.UnsignedTransactionSchema},
};

export const SmartVaultStrategyListResultSchema: FastifySchema = {
  response: {200: publicSchemas.SmartVaultStrategyListResultSchema},
};

export const SmartVaultWithdrawSchema: FastifySchema = {
  body: publicSchemas.SmartVaultWithdrawSchema,
  response: {200: publicSchemas.UnsignedTransactionSchema},
};

export const SmartVaultWithdrawEstimateSchema: FastifySchema = {
  body: publicSchemas.SmartVaultWithdrawEstimateSchema,
  response: {200: publicSchemas.SmartVaultWithdrawEstimateResultSchema},
};

export const SmartVaultCloseSchema: FastifySchema = {
  body: publicSchemas.SmartVaultCloseSchema,
  response: {200: publicSchemas.UnsignedTransactionSchema},
};

export const SumsubEventSchema: FastifySchema = {
  body: privateSchemas.SumsubEventBodySchema,
  params: {provider: {type: 'string'}},
  response: {200: {}},
};

export const LiquidityPoolsSchema: FastifySchema = {
  querystring: privateSchemas.LiquidityPoolQuerySchema,
  response: {200: publicSchemas.LiquidityPoolsResultsSchema},
};

export const LiquidityPoolSchema: FastifySchema = {
  params: publicSchemas.LiquidityPoolReferenceSchema,
  response: {200: publicSchemas.LiquidityPoolSchema},
};

export const LiquidityPoolAssetPairSchema: FastifySchema = {
  params: privateSchemas.AssetPairReferenceSchema,
  response: {200: publicSchemas.LiquidityPoolSchema},
};

export const MarketAggPriceHistorySchema: FastifySchema = {
  params: privateSchemas.AssetPairReferenceSchema,
  querystring: privateSchemas.MarketAggPriceHistoryQuerySchema,
  response: {200: publicSchemas.MarketAggPriceSchema},
};

export const MarketKlineSchema: FastifySchema = {
  params: privateSchemas.AssetPairReferenceSchema,
  querystring: privateSchemas.MarketAggPriceHistoryQuerySchema,
  response: {200: publicSchemas.MarketKlineSchema},
};

export const MarketMakerMetricsBinnedOrdersSchema: FastifySchema = {
  params: privateSchemas.AssetPairReferenceSchema,
  querystring: privateSchemas.MarketMakerMetricsBinnedOrdersQuerySchema,
  response: {200: publicSchemas.MarketMakerMetricsBinnedOrdersSchema},
};

export const TermsSchema: FastifySchema = {
  body: publicSchemas.TermsAcceptSchema,
  response: {200: {}},
};

export const TransactionSubmitSchema: FastifySchema = {
  body: publicSchemas.SignedTransactionSchema,
  response: {
    200: publicSchemas.TransactionSubmitSuccessResponseSchema,
    202: publicSchemas.TransactionSubmitAcceptedResponseSchema,
  },
};

export const UserConnectSchema: FastifySchema = {
  body: publicSchemas.UserConnectBodySchema,
  response: {200: publicSchemas.UserConnectResponseSchema},
};

// -- TWO-WAY ORDER -- //
export const TwoWayOrderPlaceSchema: FastifySchema = {
  body: publicSchemas.TwoWayOrderPlaceSchema,
  response: {200: publicSchemas.UnsignedTransactionSchema},
};

export const TwoWayOrderFillSchema: FastifySchema = {
  body: publicSchemas.TwoWayOrderFillSchema,
  response: {200: publicSchemas.UnsignedTransactionSchema},
};

export const TwoWayOrderCancelSchema: FastifySchema = {
  body: publicSchemas.TwoWayOrderCancelSchema,
  response: {200: publicSchemas.UnsignedTransactionSchema},
};

export const TwoWayOrderListSchema: FastifySchema = {
  response: {200: publicSchemas.TwoWayOrderListSchema},
};

export const TwoWayOrderGetSchema: FastifySchema = {
  params: publicSchemas.OrderReferenceSchema,
  response: {200: publicSchemas.TwoWayOrderResultSchema},
};

export const TwoWayOrderHistoryGetSchema: FastifySchema = {
  params: publicSchemas.OrderReferenceSchema,
  response: {200: publicSchemas.TwoWayOrderHistorySchema},
};

export const SlvBalanceSchema: FastifySchema = {
  response: {200: publicSchemas.SlvBalanceSchema},
};
