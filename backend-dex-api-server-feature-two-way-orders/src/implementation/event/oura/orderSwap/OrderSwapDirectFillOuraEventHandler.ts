import {inject, injectable} from 'tsyringe';

import {TransactionalContext} from '~/domain/context';

import * as Oura from '~/domain/models/oura';

import {getOrderSwapFillInitSuccessEvent} from '~/domain/events';

import {eventFilterOption, EventStreamRepository} from '~/domain/repositories';

import {OrderSwapApplication} from '~/application/orderSwap.application';
import {ConfigService, LoggerService} from '~/domain/services';
import {devStoreTransactionEvent} from './utils';

@injectable()
export class OrderSwapDirectFillOuraEventHandler implements Oura.EventHandler {
  constructor(
    @inject('ConfigService')
    private readonly configService: ConfigService,

    @inject('EventStreamRepository')
    private readonly eventStreamRepository: EventStreamRepository,

    @inject('LoggerService')
    private readonly loggerService: LoggerService,

    @inject('OrderSwapApplication')
    private readonly orderSwapApplication: OrderSwapApplication
  ) {}

  getEventHandlerMap(): Oura.HandlerFunctionMap<Oura.Event> {
    return {
      Transaction: [
        this.handleOrderSwapDirectFillOnChainOuraEventHandler.bind(this),
      ],
      BlockEnd: [],
      RollBack: [],
    };
  }

  private async handleOrderSwapDirectFillOnChainOuraEventHandler(
    context: TransactionalContext,
    event: Oura.Event
  ): Promise<void> {
    const {variant} = event;

    switch (variant) {
      case 'Transaction': {
        const {
          transaction: {hash: transactionHash},
        } = event;

        const eventStreamsByTransactionHash =
          await this.eventStreamRepository.getEventStreamsByTransactionHash(
            context,
            transactionHash,
            eventFilterOption.ORDER_SWAP
          );

        for (const orderSwapEventStream of eventStreamsByTransactionHash) {
          const {streamId: orderSwapId} = orderSwapEventStream;

          const orderSwapFillInitEvent = getOrderSwapFillInitSuccessEvent(
            orderSwapEventStream.streamEvents
          );

          if (orderSwapFillInitEvent) {
            this.loggerService.info(
              `Order Swap Direct (consumer) Fill: ${JSON.stringify(
                orderSwapFillInitEvent
              )}`
            );

            devStoreTransactionEvent(
              this.configService.isDevelopmentEnvironment(),
              'handleOrderSwapDirectFillOnChainOuraEventHandler',
              event
            );

            const {
              eventPayload: {
                userId,
                toAssetId,
                fromAssetId,
                toAssetAmount,
                fromAssetAmount,
                price,
                priceNumerator,
                priceDenominator,
              },
            } = orderSwapFillInitEvent;

            await this.orderSwapApplication.createOrUpdateOrderSwapDirectFill(
              context,
              event,
              userId,
              orderSwapId,
              transactionHash,
              toAssetId,
              fromAssetId,
              toAssetAmount,
              fromAssetAmount,
              price,
              priceNumerator,
              priceDenominator
            );
          }
        }
      }
    }
  }
}
