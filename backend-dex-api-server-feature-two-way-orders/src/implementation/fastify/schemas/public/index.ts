import BestAvailableSwapOrderResults from '~/implementation/fastify/schemas/public/BestAvailableSwapOrderResultsSchema.json';
import CancelOrderSwapSchema from '~/implementation/fastify/schemas/public/CancelSwapOrderSchema.json';
import CirculatingSupplySchema from '~/implementation/fastify/schemas/public/CirculatingSupplySchema.json';
import CreateOptionSchema from '~/implementation/fastify/schemas/public/CreateOptionSchema.json';
import CreateStakeVaultSchema from '~/implementation/fastify/schemas/public/CreateStakeVaultSchema.json';
import ExecuteOptionSchema from '~/implementation/fastify/schemas/public/ExecuteOptionSchema.json';
import FillOrderSwapSchema from '~/implementation/fastify/schemas/public/FillSwapOrderSchema.json';
import FillOrderSwapsSchema from '~/implementation/fastify/schemas/public/FillSwapOrdersSchema.json';
import LiquidityPoolReferenceSchema from '~/implementation/fastify/schemas/public/LiquidityPoolReferenceSchema.json';
import LiquidityPoolSchema from '~/implementation/fastify/schemas/public/LiquidityPoolSchema.json';
import LiquidityPoolsResultsSchema from '~/implementation/fastify/schemas/public/LiquidityPoolsResultsSchema.json';
import MarketAggPriceSchema from '~/implementation/fastify/schemas/public/MarketAggPriceSchema.json';
import MarketKlineSchema from '~/implementation/fastify/schemas/public/MarketKlineSchema.json';
import MarketMakerMetricsBinnedOrdersSchema from '~/implementation/fastify/schemas/public/MarketMakerMetricsBinnedOrdersSchema.json';
import OpenSaleOrderSchema from '~/implementation/fastify/schemas/public/OpenSaleOrderSchema.json';
import OpenOrderSwapSchema from '~/implementation/fastify/schemas/public/OpenSwapOrderSchema.json';
import OrderReferenceSchema from '~/implementation/fastify/schemas/public/OrderReferenceSchema.json';
import OrderSalePortfolioResultsSchema from '~/implementation/fastify/schemas/public/OrderSalePortfolioResultsSchema.json';
import OrderSaleProjectReferenceSchema from '~/implementation/fastify/schemas/public/OrderSaleProjectReferenceSchema.json';
import OrderSaleProjectResultsSchema from '~/implementation/fastify/schemas/public/OrderSaleProjectResultsSchema.json';
import OrderSaleProjectRoundReferenceSchema from '~/implementation/fastify/schemas/public/OrderSaleProjectRoundReferenceSchema.json';
import OrderSaleProjectResponseSchema from '~/implementation/fastify/schemas/public/OrderSaleProjectSchema.json';
import RegisterTradingWalletSchema from '~/implementation/fastify/schemas/public/RegisterTradingWalletSchema.json';
import RetrieveOptionSchema from '~/implementation/fastify/schemas/public/RetrieveOptionSchema.json';
import SignedTransactionSchema from '~/implementation/fastify/schemas/public/SignedTransactionSchema.json';
import SmartVaultStrategyListResultSchema from '~/implementation/fastify/schemas/public/SmartVaultStrategyListResultSchema.json';
import StakeVaultCreateRewardsEstimateResponse from '~/implementation/fastify/schemas/public/StakeVaultCreateRewardsEstimateResponseSchema.json';
import StakeVaultNftUsageReportSchema from '~/implementation/fastify/schemas/public/StakeVaultNftUsageReportSchema.json';
import StakeVaultsResultSchema from '~/implementation/fastify/schemas/public/StakeVaultsResultSchema.json';
import StakingProjectNftsResultSchema from '~/implementation/fastify/schemas/public/StakingProjectNftsResultSchema.json';
import StakingProjectsResultSchema from '~/implementation/fastify/schemas/public/StakingProjectsResultSchema.json';
import OrderSwapMakerTotalFeesDepositSchema from '~/implementation/fastify/schemas/public/SwapOrderMakerTotalFeesDepositSchema.json';
import OrderSwapResultsSchema from '~/implementation/fastify/schemas/public/SwapOrderResultsSchema.json';
import OrderSwapSchema from '~/implementation/fastify/schemas/public/SwapOrderSchema.json';
import OrderSwapTakerTotalFeesSchema from '~/implementation/fastify/schemas/public/SwapOrderTakerTotalFeesSchema.json';
import TermsAcceptSchema from '~/implementation/fastify/schemas/public/TermsAcceptSchema.json';
import TradingWalletRegisterResultSchema from '~/implementation/fastify/schemas/public/TradingWalletRegisterResultSchema.json';
import TradingWalletResultSchema from '~/implementation/fastify/schemas/public/TradingWalletResultSchema.json';
import TradingWalletsResultSchema from '~/implementation/fastify/schemas/public/TradingWalletsResultSchema.json';
import TransactionFeeResponseSchema from '~/implementation/fastify/schemas/public/TransactionFeeSchema.json';
import TransactionSubmitAcceptedResponseSchema from '~/implementation/fastify/schemas/public/TransactionSubmitAcceptedResponseSchema.json';
import TransactionSubmitSuccessResponseSchema from '~/implementation/fastify/schemas/public/TransactionSubmitSuccessResponseSchema.json';
import UnsignedSaleOrderSchema from '~/implementation/fastify/schemas/public/UnsignedSaleOrderSchema.json';
import UnsignedStakeVaultSchema from '~/implementation/fastify/schemas/public/UnsignedStakeVaultSchema.json';
import UnsignedOrderSwapSchema from '~/implementation/fastify/schemas/public/UnsignedTransactionSchema.json';
import UnsignedUnstakeStakeVaultSchema from '~/implementation/fastify/schemas/public/UnsignedUnstakeStakeVaultSchema.json';
import UnstakeStakeVaultSchema from '~/implementation/fastify/schemas/public/UnstakeStakeVaultSchema.json';
import UserConnectResponseSchema from '~/implementation/fastify/schemas/public/UserConnectResponseSchema.json';
import UserConnectBodySchema from '~/implementation/fastify/schemas/public/UserConnectSchema.json';
import WalletAccountSchema from '~/implementation/fastify/schemas/public/WalletAccountSchema.json';
import YieldFarmingRewardsResult from '~/implementation/fastify/schemas/public/YieldFarmingRewardsResultSchema.json';
import OrderBookSchema from './OrderBookSchema.json';
import SmartVaultCloseSchema from './SmartVaultCloseSchema.json';
import SmartVaultDepositSchema from './SmartVaultDepositSchema.json';
import SmartVaultListResultSchema from './SmartVaultListResultSchema.json';
import SmartVaultOpenSchema from './SmartVaultOpenSchema.json';
import SmartVaultOperationListResultSchema from './SmartVaultOperationListResultSchema.json';
import SmartVaultResultSchema from './SmartVaultResultSchema.json';
import SmartVaultWithdrawEstimateResultSchema from './SmartVaultWithdrawEstimateResultSchema.json';
import SmartVaultWithdrawEstimateSchema from './SmartVaultWithdrawEstimateSchema.json';
import SmartVaultWithdrawSchema from './SmartVaultWithdrawSchema.json';
import TwoWayOrderCancelSchema from './TwoWayOrderCancelSchema.json';
import TwoWayOrderFillSchema from './TwoWayOrderFillSchema.json';
import TwoWayOrderListSchema from './TwoWayOrderListSchema.json';
import TwoWayOrderResultSchema from './TwoWayOrderResultSchema.json';
import TwoWayOrderHistorySchema from './TwoWayOrderHistorySchema.json';
import TwoWayOrderPlaceSchema from './TwoWayOrderPlaceSchema.json';
import SlvBalanceSchema from './SlvBalanceSchema.json';
import UnsignedTransactionSchema from './UnsignedTransactionSchema.json';

export default {
  BestAvailableSwapOrderResults,
  CancelOrderSwapSchema,
  CirculatingSupplySchema,
  CreateStakeVaultSchema,
  FillOrderSwapSchema,
  FillOrderSwapsSchema,
  LiquidityPoolReferenceSchema,
  LiquidityPoolSchema,
  LiquidityPoolsResultsSchema,
  MarketAggPriceSchema,
  MarketKlineSchema,
  MarketMakerMetricsBinnedOrdersSchema,
  OpenOrderSwapSchema,
  OpenSaleOrderSchema,
  OrderBookSchema,
  OrderReferenceSchema,
  OrderSalePortfolioResultsSchema,
  OrderSaleProjectReferenceSchema,
  OrderSaleProjectResponseSchema,
  OrderSaleProjectResultsSchema,
  OrderSaleProjectRoundReferenceSchema,
  OrderSwapMakerTotalFeesDepositSchema,
  OrderSwapTakerTotalFeesSchema,
  OrderSwapSchema,
  OrderSwapResultsSchema,
  TradingWalletsResultSchema,
  TradingWalletResultSchema,
  TradingWalletRegisterResultSchema,
  RegisterTradingWalletSchema,
  SignedTransactionSchema,
  StakeVaultCreateRewardsEstimateResponse,
  StakeVaultNftUsageReportSchema,
  StakeVaultsResultSchema,
  StakingProjectNftsResultSchema,
  StakingProjectsResultSchema,
  TermsAcceptSchema,
  TransactionFeeResponseSchema,
  TransactionSubmitSuccessResponseSchema,
  TransactionSubmitAcceptedResponseSchema,
  UnsignedOrderSwapSchema,
  UnsignedSaleOrderSchema,
  UnsignedStakeVaultSchema,
  UnsignedTransactionSchema,
  UnsignedUnstakeStakeVaultSchema,
  UnstakeStakeVaultSchema,
  UserConnectBodySchema,
  UserConnectResponseSchema,
  WalletAccountSchema,
  YieldFarmingRewardsResult,
  CreateOptionSchema,
  RetrieveOptionSchema,
  ExecuteOptionSchema,
  SmartVaultStrategyListResultSchema,
  SmartVaultOpenSchema,
  SmartVaultDepositSchema,
  SmartVaultListResultSchema,
  SmartVaultResultSchema,
  SmartVaultOperationListResultSchema,
  SmartVaultCloseSchema,
  SmartVaultWithdrawSchema,
  SmartVaultWithdrawEstimateSchema,
  SmartVaultWithdrawEstimateResultSchema,
  TwoWayOrderListSchema,
  TwoWayOrderResultSchema,
  TwoWayOrderHistorySchema,
  TwoWayOrderPlaceSchema,
  SlvBalanceSchema,
  TwoWayOrderFillSchema,
  TwoWayOrderCancelSchema,
};
