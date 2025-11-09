import {container} from 'tsyringe';

import {FastifyInstance} from 'fastify';

import fastifyPlugin from 'fastify-plugin';
import '@fastify/basic-auth';

import {
  CardanoOuraEventSchema,
  CirculatingSupplySchema,
  CreateOptionQuerySchema,
  ExecuteOptionQuerySchema,
  LiquidityPoolAssetPairSchema,
  LiquidityPoolSchema,
  LiquidityPoolsSchema,
  MarketAggPriceHistorySchema,
  MarketKlineSchema,
  MarketMakerMetricsBinnedOrdersSchema,
  OrderBookSchema,
  OrderSwapBestAvailableOrderSchema,
  OrderSwapCancelSchema,
  OrderSwapFillFeeSchema,
  OrderSwapFillSchema,
  OrderSwapListOrdersSchema,
  OrderSwapOpenFeeSchema,
  OrderSwapOpenSchema,
  RetrieveOptionQuerySchema,
  StakeVaultCreateRewardsEstimateSchema,
  StakeVaultCreateSchema,
  StakeVaultNftUsageReport,
  StakeVaultsSchema,
  StakeVaultUnstakeSchema,
  StakingProjectNftsSchema,
  StakingProjectsSchema,
  SumsubEventSchema,
  TermsSchema,
  TradingWalletListSchema,
  TradingWalletRegisterSchema,
  TradingWalletSchema,
  TransactionSubmitSchema,
  TwoWayOrderCancelSchema,
  TwoWayOrderFillSchema,
  TwoWayOrderGetSchema,
  TwoWayOrderHistoryGetSchema,
  TwoWayOrderListSchema,
  TwoWayOrderPlaceSchema,
  UserConnectSchema,
  YieldFarmingRewardsQuerySchema,
  SlvBalanceSchema,
} from '~/implementation/fastify/schemas';

import privateSchemas from '~/implementation/fastify/schemas/private';

import {FastifyReply, FastifyRequest} from 'fastify';
import {ConfigService} from '~/domain/services';
import {isEventPresent} from '~/implementation/authorization/event/authorizationChecks';
import {
  getStakingAuthorizationChecks,
  isCreateStakeVaultEnabled,
  isStakingProjectWebEnabled,
} from '~/implementation/authorization/staking';
import {getSubmitAuthorizationChecks} from '~/implementation/authorization/submit/dynamicAuthorizationCheckResolver';
import {isUserPresent} from '~/implementation/authorization/user/authorizationChecks';
import {userIsPresentAuthorization} from '~/implementation/authorization/user/rules';
import {authorizationHook} from '~/implementation/fastify/hook/authorization';

import {AssetQueryFastify} from '~/implementation/fastify/asset.query';
import {LiquidityPoolQueryFastify} from '~/implementation/fastify/liquidityPool.query';
import {OptionsMutationFastify} from '~/implementation/fastify/options.mutation';
import {OrderBookQueryFastify} from '~/implementation/fastify/orderBook.query';
import {OrderSaleMutationFastify} from '~/implementation/fastify/orderSale.mutation';
import {OrderSaleQueryFastify} from '~/implementation/fastify/orderSale.query';
import {OrderSaleProjectQueryFastify} from '~/implementation/fastify/orderSaleProject.query';
import {OrderSwapMutationFastify} from '~/implementation/fastify/orderSwap.mutation';
import {OrderSwapQueryFastify} from '~/implementation/fastify/orderSwap.query';
import {StakeVaultMutationFastify} from '~/implementation/fastify/stakeVault.mutation';
import {StakeVaultQueryFastify} from '~/implementation/fastify/stakeVault.query';
import {StakingProjectQueryFastify} from '~/implementation/fastify/stakingProject.query';
import {TradingPairQueryFastify} from '~/implementation/fastify/tradingPair.query';
import {TradingWalletMutationFastify} from '~/implementation/fastify/tradingWallet.mutation';
import {TradingWalletQueryFastify} from '~/implementation/fastify/tradingWallet.query';
import {TransactionMutationFastify} from '~/implementation/fastify/transaction.mutation';
import {TwoWayOrderMutationFastify} from '~/implementation/fastify/twoWayOrder.mutation';
import {TwoWayOrderQueryFastify} from '~/implementation/fastify/twoWayOrder.query';
import {UserMutationFastify} from '~/implementation/fastify/user.mutation';
import {YieldFarmingMutationFastify} from '~/implementation/fastify/yieldFarming.mutation';
import {YieldFarmingQueryFastify} from '~/implementation/fastify/yieldFarming.query';
import {MarketDataQueryFastify} from '../marketData.query';

import {isUserStakeVaultCreator} from '~/implementation/authorization/staking';
import {PrivateOrderSaleProjectMutationFastify} from '~/implementation/fastify/privateOrderSaleProject.mutation';

const assetQuery = container.resolve(AssetQueryFastify);
const liquidityPoolQuery = container.resolve(LiquidityPoolQueryFastify);
const marketDataQuery = container.resolve(MarketDataQueryFastify);
const orderBookQuery = container.resolve(OrderBookQueryFastify);
const orderSaleProjectQuery = container.resolve(OrderSaleProjectQueryFastify);
const orderSaleQuery = container.resolve(OrderSaleQueryFastify);
const orderSwapQuery = container.resolve(OrderSwapQueryFastify);
const tradingWalletQuery = container.resolve(TradingWalletQueryFastify);
const stakeVaultQuery = container.resolve(StakeVaultQueryFastify);
const stakingProjectQuery = container.resolve(StakingProjectQueryFastify);
const yieldFarmingQuery = container.resolve(YieldFarmingQueryFastify);
const tradingPairQuery = container.resolve(TradingPairQueryFastify);

const orderSaleMutation = container.resolve(OrderSaleMutationFastify);
const orderSwapMutation = container.resolve(OrderSwapMutationFastify);
const tradingWalletMutation = container.resolve(TradingWalletMutationFastify);
const stakeVaultMutation = container.resolve(StakeVaultMutationFastify);
const transactionMutation = container.resolve(TransactionMutationFastify);
const userMutation = container.resolve(UserMutationFastify);
const yieldFarmingMutation = container.resolve(YieldFarmingMutationFastify);
const optionsMutation = container.resolve(OptionsMutationFastify);

const privateOrderSaleProjectMutation = container.resolve(
  PrivateOrderSaleProjectMutationFastify
);

export default fastifyPlugin(
  async (fastify: FastifyInstance): Promise<void> => {
    fastify.get('/', async (): Promise<void> => {}); // Health check

    fastify.post('/transaction/submit', {
      schema: TransactionSubmitSchema,
      preHandler: await authorizationHook(
        [isUserPresent, isEventPresent],
        [getSubmitAuthorizationChecks]
      ),
      handler:
        transactionMutation.submitTransactionOrEnqueue.bind(
          transactionMutation
        ),
    });

    fastify.get('/circulating-supply/:assetId', {
      schema: CirculatingSupplySchema,
      handler: assetQuery.getAssetCirculatingSupply.bind(assetQuery),
    });

    fastify.post('/user/connect', {
      schema: UserConnectSchema,
      handler: userMutation.postUserConnect.bind(userMutation),
    });

    fastify.post('/terms/accept', {
      schema: TermsSchema,
      preHandler: await authorizationHook(userIsPresentAuthorization),
      handler: userMutation.postTermsAccept.bind(userMutation),
    });

    fastify.post('/user/event-:provider(sumsub)', {
      schema: SumsubEventSchema,
      handler: userMutation.postUserKycEvent.bind(userMutation),
    });

    fastify.post('/cardano/event-:provider(oura)', {
      schema: CardanoOuraEventSchema,
      onRequest: fastify.basicAuth,
      handler: transactionMutation.handleOuraEvent.bind(transactionMutation),
    });

    // -- TWO-WAY ORDER --
    const twoWayOrderMutation = container.resolve(TwoWayOrderMutationFastify);
    const twoWayOrderQuery = container.resolve(TwoWayOrderQueryFastify);
    const configService = container.resolve<ConfigService>('ConfigService');

    const twoWayEnabledPreHandler = async (
      _req: FastifyRequest,
      reply: FastifyReply
    ) => {
      if (!configService.isDexTwoWayOrderFeatureEnabled()) {
        reply.code(404).send({errorCode: 'FEATURE_DISABLED'});
      }
    };

    // Validate that the (fromAssetId, toAssetId) is a supported trading pair
    const twoWayTradingPairPreHandler = async (
      req: FastifyRequest,
      reply: FastifyReply
    ) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const body: any = (req as any).body;
      const fromAssetId: string | undefined = body?.fromAssetId;
      const toAssetId: string | undefined = body?.toAssetId;
      if (!fromAssetId || !toAssetId) {
        reply.code(400).send({errorCode: 'TWO__ASSET_IDS_REQUIRED'});
        return;
      }

      const prisma = container.resolve(
        'PrismaClient'
      ) as unknown as import('@prisma/client').PrismaClient;
      const pair = await prisma.tradingPair.findFirst({
        where: {
          OR: [
            {baseAssetId: fromAssetId, quoteAssetId: toAssetId},
            {baseAssetId: toAssetId, quoteAssetId: fromAssetId},
          ],
        },
      });
      if (!pair) {
        reply.code(400).send({errorCode: 'TWO__TRADING_PAIR_NOT_SUPPORTED'});
      }
    };

    fastify.get('/two-way-order', {
      schema: {
        querystring: privateSchemas.TwoWayOrderQuerySchema,
        response: TwoWayOrderListSchema.response,
      },
      preHandler: twoWayEnabledPreHandler,
      handler: twoWayOrderQuery.list.bind(twoWayOrderQuery),
    });

    fastify.get('/two-way-order/:orderId', {
      schema: TwoWayOrderGetSchema,
      preHandler: twoWayEnabledPreHandler,
      handler: twoWayOrderQuery.getById.bind(twoWayOrderQuery),
    });

    fastify.get('/two-way-order/:orderId/history', {
      schema: TwoWayOrderHistoryGetSchema,
      preHandler: twoWayEnabledPreHandler,
      handler: twoWayOrderQuery.history.bind(twoWayOrderQuery),
    });

    fastify.get('/slv/balance', {
      schema: SlvBalanceSchema,
      preHandler: twoWayEnabledPreHandler,
      handler: twoWayOrderQuery.slvBalance.bind(twoWayOrderQuery),
    });

    fastify.post('/two-way-order/place', {
      schema: TwoWayOrderPlaceSchema,
      preHandler: [
        twoWayEnabledPreHandler,
        twoWayTradingPairPreHandler,
        await authorizationHook(userIsPresentAuthorization),
      ],
      handler: twoWayOrderMutation.place.bind(twoWayOrderMutation),
    });

    fastify.post('/two-way-order/fill', {
      schema: TwoWayOrderFillSchema,
      preHandler: [
        twoWayEnabledPreHandler,
        await authorizationHook(userIsPresentAuthorization),
      ],
      handler: twoWayOrderMutation.fill.bind(twoWayOrderMutation),
    });

    fastify.post('/two-way-order/cancel', {
      schema: TwoWayOrderCancelSchema,
      preHandler: [
        twoWayEnabledPreHandler,
        await authorizationHook(userIsPresentAuthorization),
      ],
      handler: twoWayOrderMutation.cancel.bind(twoWayOrderMutation),
    });

    fastify.get('/liquidity-pool', {
      schema: LiquidityPoolsSchema,
      handler: liquidityPoolQuery.listLiquidityPools.bind(liquidityPoolQuery),
    });

    fastify.get('/liquidity-pool/:liquidityPoolId', {
      schema: LiquidityPoolSchema,
      handler: liquidityPoolQuery.getLiquidityPool.bind(liquidityPoolQuery),
    });

    fastify.get('/liquidity-pool/byAssets/:assetPair', {
      schema: LiquidityPoolAssetPairSchema,
      handler:
        liquidityPoolQuery.getLiquidityPoolByAssets.bind(liquidityPoolQuery),
    });

    fastify.get('/market/by-asset-pair/:assetPair/agg-price-history', {
      schema: MarketAggPriceHistorySchema,
      handler: marketDataQuery.getMarketAggPrice.bind(marketDataQuery),
    });

    fastify.get('/market/by-asset-pair/:assetPair/kline', {
      schema: MarketKlineSchema,
      handler: marketDataQuery.getMarketKline.bind(marketDataQuery),
    });

    fastify.get(
      '/market/by-asset-pair/:assetPair/maker-metrics/binned-orders',
      {
        schema: MarketMakerMetricsBinnedOrdersSchema,
        handler:
          marketDataQuery.getWalletMarketMakerMetricsBinnedOrders.bind(
            marketDataQuery
          ),
      }
    );

    fastify.get('/order-book/by-asset-pair/:assetPair', {
      schema: OrderBookSchema,
      handler:
        orderBookQuery.getOrderBookByAssetPairAssetIds.bind(orderBookQuery),
    });

    // fastify.get('/order-sale/portfolio', {
    //   schema: OrderSalePortfolioSchema,
    //   handler: orderSaleProjectQuery.listPortfolio.bind(orderSaleProjectQuery),
    // });

    // fastify.get('/order-sale/projects', {
    //   schema: OrderSaleProjectsSchema,
    //   handler: orderSaleProjectQuery.listOrderSaleProjects.bind(
    //     orderSaleProjectQuery
    //   ),
    // });

    // fastify.get('/order-sale/project/:orderSaleProjectId', {
    //   schema: OrderSaleProjectSchema,
    //   handler: orderSaleProjectQuery.getOrderSaleProject.bind(
    //     orderSaleProjectQuery
    //   ),
    // });

    // fastify.post('/order-sale/fee', {
    //   schema: OrderSaleTotalFeesDepositSchema,
    //   preHandler: await authorizationHook(userIsPresentAndValidAuthorization, [
    //     getProjectAuthorizationChecks,
    //   ]),
    //   handler: orderSaleQuery.orderFee.bind(orderSaleQuery),
    // });

    // fastify.post('/order-sale/open', {
    //   schema: OrderSaleOpenSchema,
    //   preHandler: await authorizationHook(userIsPresentAndValidAuthorization, [
    //     getProjectAuthorizationChecks,
    //   ]),
    //   handler: orderSaleMutation.orderCreate.bind(orderSaleMutation),
    // });

    // fastify.put('/order-sale/:orderId/cancel', {
    //   schema: OrderSaleCancelSchema,
    //   preHandler: await authorizationHook([
    //     ...userIsPresentAndValidAuthorization,
    //     isCancellationValid,
    //   ]),
    //   handler: orderSaleMutation.orderCancel.bind(orderSaleMutation),
    // });

    // fastify.put('/order-sale/project/round/:roundId/whitelist', {
    //   schema: OrderSaleProjectReplaceWhitelistSchema,
    //   onRequest: fastify.basicAuth,
    //   handler: privateOrderSaleProjectMutation.replaceWhitelist.bind(
    //     privateOrderSaleProjectMutation
    //   ),
    // });

    fastify.get('/order-swap', {
      schema: OrderSwapListOrdersSchema,
      handler: orderSwapQuery.listOrdersSwap.bind(orderSwapQuery),
    });

    fastify.get('/order-swap/best-available', {
      schema: OrderSwapBestAvailableOrderSchema,
      handler: orderSwapQuery.getOrderSwapBestAvailable.bind(orderSwapQuery),
    });

    fastify.post('/order-swap/open/fee', {
      schema: OrderSwapOpenFeeSchema,
      preHandler: await authorizationHook(userIsPresentAuthorization),
      handler: orderSwapQuery.getOrderSwapOpenFee.bind(orderSwapQuery),
    });

    fastify.post('/order-swap/open', {
      schema: OrderSwapOpenSchema,
      preHandler: await authorizationHook(userIsPresentAuthorization),
      handler: orderSwapMutation.openOrderSwap.bind(orderSwapMutation),
    });

    fastify.post('/order-swap/fill', {
      schema: OrderSwapFillSchema,
      preHandler: await authorizationHook(userIsPresentAuthorization),
      handler: orderSwapMutation.fillOrderSwaps.bind(orderSwapMutation),
    });

    fastify.post('/order-swap/fill/fee', {
      schema: OrderSwapFillFeeSchema,
      preHandler: await authorizationHook(userIsPresentAuthorization),
      handler: orderSwapQuery.getOrderSwapFillFee.bind(orderSwapQuery),
    });

    fastify.put('/order-swap/:orderId/cancel', {
      schema: OrderSwapCancelSchema,
      preHandler: await authorizationHook(userIsPresentAuthorization),
      handler: orderSwapMutation.cancelOrderSwap.bind(orderSwapMutation),
    });

    fastify.get('/trading-wallet', {
      schema: TradingWalletListSchema,
      handler: tradingWalletQuery.listTradingWallets.bind(tradingWalletQuery),
    });

    fastify.get('/trading-wallet/:tradingWalletId', {
      schema: TradingWalletSchema,
      handler: tradingWalletQuery.getTradingWallet.bind(tradingWalletQuery),
    });

    fastify.post('/trading-wallet/register', {
      schema: TradingWalletRegisterSchema,
      preHandler: await authorizationHook(userIsPresentAuthorization),
      handler: tradingWalletMutation.registerTradingWallet.bind(
        tradingWalletMutation
      ),
    });

    fastify.get('/stake-vaults', {
      schema: StakeVaultsSchema,
      handler: stakeVaultQuery.listStakeVaults.bind(stakeVaultQuery),
    });

    fastify.post('/stake-vault/create', {
      schema: StakeVaultCreateSchema,
      preHandler: await authorizationHook(
        [
          ...userIsPresentAuthorization,
          isCreateStakeVaultEnabled,
          isStakingProjectWebEnabled,
        ],
        [getStakingAuthorizationChecks]
      ),
      handler: stakeVaultMutation.stakeVaultCreate.bind(stakeVaultMutation),
    });

    fastify.post('/stake-vault/create/rewards-estimate', {
      schema: StakeVaultCreateRewardsEstimateSchema,
      preHandler: await authorizationHook(userIsPresentAuthorization, [
        getStakingAuthorizationChecks,
      ]),
      handler: stakeVaultQuery.getStakingRewardsEstimate.bind(stakeVaultQuery),
    });

    fastify.post('/stake-vault/unstake', {
      schema: StakeVaultUnstakeSchema,
      preHandler: await authorizationHook([isUserStakeVaultCreator], []),
      handler: stakeVaultMutation.stakeVaultUnstake.bind(stakeVaultMutation),
    });

    fastify.get('/stake-vault/nft-usage-report/:assetId', {
      schema: StakeVaultNftUsageReport,
      preHandler: await authorizationHook(userIsPresentAuthorization),
      handler:
        stakeVaultQuery.getStakeVaultNftUsageReport.bind(stakeVaultQuery),
    });

    fastify.get('/staking-projects', {
      schema: StakingProjectsSchema,
      handler:
        stakingProjectQuery.listStakingProjects.bind(stakingProjectQuery),
    });

    fastify.post('/staking-project/:stakingProjectId/nfts', {
      schema: StakingProjectNftsSchema,
      handler:
        stakingProjectQuery.listStakingProjectNfts.bind(stakingProjectQuery),
    });

    fastify.get('/yield-farming/rewards', {
      schema: YieldFarmingRewardsQuerySchema,
      preHandler: await authorizationHook(userIsPresentAuthorization),
      handler: yieldFarmingQuery.listRewards.bind(yieldFarmingQuery),
    });

    fastify.post('/yield-farming/rewards/claim', {
      preHandler: await authorizationHook(userIsPresentAuthorization),
      handler: yieldFarmingMutation.rewardsClaim.bind(yieldFarmingMutation),
    });

    fastify.post('/option/create', {
      schema: CreateOptionQuerySchema,
      preHandler: await authorizationHook(userIsPresentAuthorization),
      handler: optionsMutation.createOption.bind(optionsMutation),
    });

    fastify.post('/option/retrieve', {
      schema: RetrieveOptionQuerySchema,
      preHandler: await authorizationHook(userIsPresentAuthorization),
      handler: optionsMutation.retrieveOption.bind(optionsMutation),
    });

    fastify.post('/option/execute', {
      schema: ExecuteOptionQuerySchema,
      preHandler: await authorizationHook(userIsPresentAuthorization),
      handler: optionsMutation.executeOption.bind(optionsMutation),
    });

    fastify.get('/trading-pair', {
      handler: tradingPairQuery.listTradingPairs.bind(tradingPairQuery),
    });
  }
);
