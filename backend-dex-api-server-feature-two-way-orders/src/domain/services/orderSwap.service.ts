import {inject, injectable, singleton} from 'tsyringe';

import * as Private from '~/domain/models/private';
import {
  EventStream,
  getOrderSwapFillInitSuccessEventOrThrow,
  OrderSwapEvent,
} from '../events';
import {OrderSwapMutation} from '../events/mutation';
import {OrderSwapOnChainFailureEventPayload} from '../events/orderSwap/shared/OrderSwapOnChainEvent';
import {ErrorCode} from '../errors';
import {
  onChainEventSuccessToFailureMapper,
  OnChainFailureErrorDetails,
  OnChainFailureEventType,
  OrderSwapOnChainSuccessEvent,
} from '../events/orderSwap/shared/OrderSwapOnChainEvent';
import {map, reduce} from 'lodash';
import Big from 'big.js';

export interface OrderSwapService {
  appendEventStreamWithOnChainFailureEvents(
    eventStream: EventStream<OrderSwapEvent>,
    eventsToInvalidate: OrderSwapOnChainSuccessEvent[],
    rollbackDetails: Omit<
      OnChainFailureErrorDetails,
      'invalidatedEventId' | 'invalidatedTransactionHash'
    >
  ): EventStream<OrderSwapEvent>;

  getUtxoRefsFromFillEventStream(
    eventStream: EventStream<OrderSwapEvent>
  ): Private.UtxoRef[];

  calculateTotalToAssetAmountRequired(
    bestAvailableOrderSwapsWithAmounts: Private.BestAvailableOrderSwapResults
  ): Big;
}

@singleton()
@injectable()
export class OrderSwapServiceImplementation implements OrderSwapService {
  constructor(
    @inject('OrderSwapMutation')
    private readonly orderSwapMutation: OrderSwapMutation
  ) {}

  private appendOnChainFailureEvent(
    eventStream: EventStream<OrderSwapEvent>,
    eventPayload: OrderSwapOnChainFailureEventPayload,
    failureEventTypeToAppend: OnChainFailureEventType
  ): EventStream<OrderSwapEvent> {
    switch (failureEventTypeToAppend) {
      case 'ORDER_SWAP__OPEN_ONCHAIN__FAILURE':
        return this.orderSwapMutation.orderSwapOpenOnChainFailure(
          eventStream,
          eventPayload
        );
      case 'ORDER_SWAP__FILL_ONCHAIN__FAILURE':
        return this.orderSwapMutation.orderSwapFillOnChainFailure(
          eventStream,
          eventPayload
        );
      case 'ORDER_SWAP__PARTIAL_FILL_ONCHAIN__FAILURE':
        return this.orderSwapMutation.orderSwapPartialFillOnChainFailure(
          eventStream,
          eventPayload
        );
      case 'ORDER_SWAP__FINAL_FILL_ONCHAIN__FAILURE':
        return this.orderSwapMutation.orderSwapFinalFillOnChainFailure(
          eventStream,
          eventPayload
        );
      case 'ORDER_SWAP__CANCEL_ONCHAIN__FAILURE':
        return this.orderSwapMutation.orderSwapCancelOnChainFailure(
          eventStream,
          eventPayload
        );
      default: {
        /**
         * Typing this as `never` will make TypeScript warn us if we have not
         * handled all event types in our above cases.
         */
        const unhandledEventType: never = failureEventTypeToAppend;
        console.warn(
          `Expected on-chain failure event ${unhandledEventType} to be handled`
        );
        return eventStream;
      }
    }
  }

  appendEventStreamWithOnChainFailureEvents(
    eventStream: EventStream<OrderSwapEvent>,
    eventsToInvalidate: OrderSwapOnChainSuccessEvent[],
    rollbackDetails: Omit<
      OnChainFailureErrorDetails,
      'invalidatedEventId' | 'invalidatedTransactionHash'
    >
  ): EventStream<OrderSwapEvent> {
    return reduce(
      eventsToInvalidate,
      (resultingEventStream, eventToInvalidate) => {
        const failureEventTypeToAppend: OnChainFailureEventType =
          onChainEventSuccessToFailureMapper[eventToInvalidate.eventType];

        const onChainFailureErrorDetails: OnChainFailureErrorDetails = {
          ...rollbackDetails,
          invalidatedEventId: eventToInvalidate.eventId,
          invalidatedTransactionHash: eventToInvalidate.transactionHash,
        };

        const {
          streamId: orderSwapId,
          eventPayload: {userId},
        } = eventToInvalidate;

        const eventPayload: OrderSwapOnChainFailureEventPayload = {
          userId,
          orderSwapId,
          errorCode: ErrorCode.ONCHAIN_EVENT__BLOCK_ROLLBACK,
          errorReason:
            `On-chain event with type ${eventToInvalidate.eventType}` +
            ` was invalidated due to a roll back to block ${onChainFailureErrorDetails.rollBackBlock.blockHash}`,
          errorDetails: onChainFailureErrorDetails,
        };

        return this.appendOnChainFailureEvent(
          resultingEventStream,
          eventPayload,
          failureEventTypeToAppend
        );
      },
      eventStream
    );
  }

  getUtxoRefsFromFillEventStream(eventStream: EventStream<OrderSwapEvent>) {
    const {
      eventPayload: {filledOrderSwapUnspentOutputReferenceWithAmounts},
    } = getOrderSwapFillInitSuccessEventOrThrow(eventStream.streamEvents);

    const utxoRefs = map(
      filledOrderSwapUnspentOutputReferenceWithAmounts,
      ({
        filledOrderSwapUnspentOutputReference: {
          filledOrderSwapUtxoReferenceIndex: utxoReferenceIndex,
          filledOrderSwapUtxoReferenceTransactionHash:
            utxoReferenceTransactionHash,
        },
      }) => ({utxoReferenceTransactionHash, utxoReferenceIndex})
    );

    return utxoRefs;
  }

  calculateTotalToAssetAmountRequired(
    bestAvailableOrderSwapsWithAmounts: Private.BestAvailableOrderSwapResults
  ): Big {
    return bestAvailableOrderSwapsWithAmounts.reduce(
      (total, {marketOrderSwapToAmount}) => {
        const toAmountBig = new Big(marketOrderSwapToAmount);
        return total.add(toAmountBig);
      },
      new Big(0)
    );
  }
}
