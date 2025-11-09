import {inject, injectable, singleton} from 'tsyringe';

import {map} from 'lodash';

import * as Public from '~/domain/models/public';
import * as Private from '~/domain/models/private';
import {TransactionalContext} from '~/domain/context';

import {DomainMapper} from '~/implementation/prisma/domain.mapper';

import {MarketOrderPriceService} from '~/domain/services';

import {
  AssetRepository,
  eventFilterOption,
  EventStreamRepository,
  OrderBookRepository,
} from '~/domain/repositories';
import {TradingPairRepository} from '~/domain/repositories/tradingPair.repository';
import {ErrorCode} from '~/domain/errors';
import {OrderSwapEvent} from '~/domain/events';

@singleton()
@injectable()
export class OrderBookApplication {
  constructor(
    @inject('AssetRepository')
    private readonly assetRepository: AssetRepository,

    @inject('OrderBookRepository')
    private readonly orderBookRepository: OrderBookRepository,

    @inject('MarketOrderPriceService')
    private readonly marketOrderPriceService: MarketOrderPriceService,

    @inject('DomainMapper')
    private readonly domainMapper: DomainMapper,

    @inject('EventStreamRepository')
    private readonly eventStreamRepository: EventStreamRepository<OrderSwapEvent>,

    @inject('TradingPairRepository')
    private readonly tradingPairRepository: TradingPairRepository
  ) {}

  async getOrderBookByAssetPairAssetIds(
    context: TransactionalContext,
    assetOneId: string,
    assetTwoId: string
  ): Promise<Public.OrderBook> {
    const tradingPair =
      await this.tradingPairRepository.getTradingPairByAssetIdPair(context, [
        assetOneId,
        assetTwoId,
      ]);

    if (!tradingPair) {
      throw new Error(ErrorCode.TRADING_PAIR_NOT_FOUND);
    }

    const {baseAsset, baseAssetId, quoteAsset, quoteAssetId} = tradingPair;

    const marketPriceOrderQueryTakeLimit = 7;

    const lastOrderSwapFills =
      await this.orderBookRepository.getLastNOrderSwapFillsForAssetPair(
        context,
        baseAssetId,
        quoteAssetId,
        marketPriceOrderQueryTakeLimit
      );

    const marketPrice = this.marketOrderPriceService.calculateVWAPMarketPrice(
      lastOrderSwapFills,
      baseAsset,
      quoteAsset
    );
    // Sell orders (buy button)
    const sortedOpenAskOrders =
      await this.orderBookRepository.getSortedOpenOrderBookSwapsByAssetIds(
        context,
        quoteAssetId,
        baseAssetId
      );

    // Buy orders (sell button)
    // Retrieved orders are in the opposite direction of the request
    const sortedOpenBidOrders =
      await this.orderBookRepository.getSortedOpenOrderBookSwapsByAssetIds(
        context,
        baseAssetId,
        quoteAssetId
      );

    const orderBookAssetsMap = Private.toAssetsMap([baseAsset, quoteAsset]);

    const publicOrderBookAskSwapOrderEntries =
      await this.toPublicOrderBookSwapOrderEntries(
        context,
        sortedOpenAskOrders,
        orderBookAssetsMap
      );

    const publicOrderBookBidSwapOrderEntries =
      await this.toPublicOrderBookSwapOrderEntries(
        context,
        sortedOpenBidOrders,
        orderBookAssetsMap
      );

    return {
      baseAssetId,
      quoteAssetId,
      marketPrice: marketPrice.toString(),
      askOrderBookEntries: publicOrderBookAskSwapOrderEntries,
      bidOrderBookEntries: publicOrderBookBidSwapOrderEntries,
    };
  }

  async toPublicOrderBookSwapOrderEntries(
    context: TransactionalContext,
    ordersSwap: Private.ValidOrderSwap[],
    orderBookAssetsMap: Private.AssetsMap
  ): Promise<Public.OrderBookEntry[]> {
    const orderSwapsWithEventStream = await Promise.all(
      map(ordersSwap, async orderSwap => {
        const {orderSwapId} = orderSwap;

        const {streamEvents} =
          await this.eventStreamRepository.getEventStreamByStreamId(
            context,
            orderSwapId,
            eventFilterOption.ORDER_SWAP
          );

        return {
          orderSwap,
          streamEvents,
        };
      })
    );

    const publicSwapOrders: Public.SwapOrder[] = map(
      orderSwapsWithEventStream,
      ({orderSwap, streamEvents}) =>
        this.domainMapper.toPublicOrderSwaps(orderBookAssetsMap, {
          orderSwap,
          streamEvents,
        })
    );

    const publicOrderBookSwapOrderEntries = map(publicSwapOrders, order => ({
      order,
      orderBookEntryType: Private.OrderBookEntryType.SwapOrder,
    }));

    return publicOrderBookSwapOrderEntries;
  }
}
