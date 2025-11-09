import {injectable} from 'tsyringe';

import {Hex} from '~/domain/models/cardano';

import * as Private from '~/domain/models/private';
import * as Public from '~/domain/models/public';

import {
  EventStream,
  OrderSwapCancelInitRequestEventPayload,
  OrderSwapCancelInitSuccessEventPayload,
  OrderSwapCancelOnChainSuccessEventPayload,
  OrderSwapCancelOnChainFailureEventPayload,
  OrderSwapFillInitRequestEventPayload,
  OrderSwapFillInitSuccessEventPayload,
  OrderSwapFillOnChainSuccessEventPayload,
  OrderSwapFinalFillOnChainSuccessEventPayload,
  OrderSwapOpenOnChainSuccessEventPayload,
  OrderSwapOpenOnChainFailureEventPayload,
  OrderSwapPartialFillOnChainSuccessEventPayload,
  getOrderSwapCancelInitSuccessEventOrThrow,
  getOrderSwapFillInitSuccessEventOrThrow,
  getOrderSwapOpenInitSuccessEventOrThrow,
  EventTypes,
  makeOrderSwapDomainEvent,
  makeOrderSwapDomainEventTransaction,
  makeOrderSwapDomainEventTransactionOnChain,
  appendEventToEventStream,
  OrderSwapEvent,
} from '~/domain/events';

import {OrderSwapFillOnChainFailureEventPayload} from '../../orderSwap/OrderSwapFillOnChainFailureEvent';
import {OrderSwapPartialFillOnChainFailureEventPayload} from '../../orderSwap/OrderSwapPartialFillOnChainFailureEvent';
import {OrderSwapFinalFillOnChainFailureEventPayload} from '../../orderSwap/OrderSwapFinalFillOnChainFailureEvent';

export type OrderSwapFailureEventHandler = (
  orderSwapEventStream: EventStream<OrderSwapEvent>,
  transactionHash: string,
  errorCodeReason: Private.ErrorCodeReason
) => EventStream;

@injectable()
export class OrderSwapMutation {
  orderSwapOpenInitRequest(
    orderSwapEventStream: EventStream<OrderSwapEvent>,
    userId: string,
    orderSwapData: Public.SwapOrderData
  ): EventStream<OrderSwapEvent> {
    const {streamId: orderSwapId} = orderSwapEventStream;

    const event = makeOrderSwapDomainEvent(
      orderSwapId,
      EventTypes.ORDER_SWAP__OPEN_INIT__REQUEST,
      {
        userId,
        ...orderSwapData,
      }
    );

    return appendEventToEventStream(orderSwapEventStream, event);
  }

  orderSwapOpenInitSuccess(
    userId: string,
    transactionHash: Hex,
    mintAssetId: string,
    orderSwapEventStream: EventStream<OrderSwapEvent>,
    orderSwapData: Private.OrderSwapMakerFeesTransactionFeeAndDeposit
  ): EventStream<OrderSwapEvent> {
    const {streamId: orderSwapId} = orderSwapEventStream;

    const event = makeOrderSwapDomainEventTransaction(
      orderSwapId,
      EventTypes.ORDER_SWAP__OPEN_INIT__SUCCESS,
      {
        mintAssetId,
        userId,
        orderSwapId,
        ...orderSwapData,
      },
      transactionHash
    );

    return appendEventToEventStream(orderSwapEventStream, event);
  }

  orderSwapOpenInitFailure(
    orderSwapEventStream: EventStream<OrderSwapEvent>,
    userId: string,
    errorCodeReason: Private.ErrorCodeReason
  ): EventStream<OrderSwapEvent> {
    const {streamId: orderSwapId} = orderSwapEventStream;

    const event = makeOrderSwapDomainEvent(
      orderSwapId,
      EventTypes.ORDER_SWAP__OPEN_INIT__FAILURE,
      {
        userId,
        orderSwapId,
        ...errorCodeReason,
      }
    );

    return appendEventToEventStream(orderSwapEventStream, event);
  }

  orderSwapOpenSubmitSuccess(
    orderSwapEventStream: EventStream<OrderSwapEvent>
  ): EventStream<OrderSwapEvent> {
    const {streamId: orderSwapId, streamEvents: orderSwapEvents} =
      orderSwapEventStream;

    const orderSwapOpenInitEvent =
      getOrderSwapOpenInitSuccessEventOrThrow(orderSwapEvents);

    const {transactionHash} = orderSwapOpenInitEvent;

    const event = makeOrderSwapDomainEventTransaction(
      orderSwapId,
      EventTypes.ORDER_SWAP__OPEN_SUBMIT__SUCCESS,
      {
        orderSwapId,
      },
      transactionHash
    );

    return appendEventToEventStream(orderSwapEventStream, event);
  }

  orderSwapOpenSubmitFailure(
    orderSwapEventStream: EventStream<OrderSwapEvent>,
    transactionHash: string,
    errorCodeReason: Private.ErrorCodeReason
  ): EventStream<OrderSwapEvent> {
    const {streamId: orderSwapId} = orderSwapEventStream;

    const event = makeOrderSwapDomainEventTransaction(
      orderSwapId,
      EventTypes.ORDER_SWAP__OPEN_SUBMIT__FAILURE,
      {
        orderSwapId,
        ...errorCodeReason,
      },
      transactionHash
    );

    return appendEventToEventStream(orderSwapEventStream, event);
  }

  orderSwapFillInitRequest(
    orderSwapEventStream: EventStream<OrderSwapEvent>,
    eventPayload: OrderSwapFillInitRequestEventPayload
  ) {
    const {streamId: orderSwapId} = orderSwapEventStream;

    const event = makeOrderSwapDomainEvent(
      orderSwapId,
      EventTypes.ORDER_SWAP__FILL_INIT__REQUEST,
      eventPayload
    );

    return appendEventToEventStream(orderSwapEventStream, event);
  }

  orderSwapFillInitSuccess(
    orderSwapEventStream: EventStream<OrderSwapEvent>,
    transactionHash: Hex,
    eventPayload: OrderSwapFillInitSuccessEventPayload
  ): EventStream<OrderSwapEvent> {
    const {streamId: orderSwapId} = orderSwapEventStream;

    const event = makeOrderSwapDomainEventTransaction(
      orderSwapId,
      EventTypes.ORDER_SWAP__FILL_INIT__SUCCESS,
      eventPayload,
      transactionHash
    );

    return appendEventToEventStream(orderSwapEventStream, event);
  }

  orderSwapFillInitFailure(
    orderSwapEventStream: EventStream<OrderSwapEvent>,
    userId: string,
    errorCodeReason: Private.ErrorCodeReason
  ): EventStream<OrderSwapEvent> {
    const {streamId: orderSwapId} = orderSwapEventStream;

    const event = makeOrderSwapDomainEvent(
      orderSwapId,
      EventTypes.ORDER_SWAP__FILL_INIT__FAILURE,
      {
        orderSwapId,
        userId,
        ...errorCodeReason,
      }
    );

    return appendEventToEventStream(orderSwapEventStream, event);
  }

  orderSwapFillSubmit(
    orderSwapEventStream: EventStream<OrderSwapEvent>
  ): EventStream<OrderSwapEvent> {
    const {streamId: orderSwapId, streamEvents: orderSwapEvents} =
      orderSwapEventStream;

    const orderSwapFillInitEvent =
      getOrderSwapFillInitSuccessEventOrThrow(orderSwapEvents);

    const {transactionHash} = orderSwapFillInitEvent;

    const event = makeOrderSwapDomainEventTransaction(
      orderSwapId,
      EventTypes.ORDER_SWAP__FILL_SUBMIT__SUCCESS,
      {
        orderSwapId,
      },
      transactionHash
    );

    return appendEventToEventStream(orderSwapEventStream, event);
  }

  orderSwapFillSubmitFailure(
    orderSwapEventStream: EventStream<OrderSwapEvent>,
    transactionHash: string,
    errorCodeReason: Private.ErrorCodeReason
  ): EventStream<OrderSwapEvent> {
    const {streamId: orderSwapId} = orderSwapEventStream;

    const event = makeOrderSwapDomainEventTransaction(
      orderSwapId,
      EventTypes.ORDER_SWAP__FILL_SUBMIT__FAILURE,
      {
        orderSwapId,
        ...errorCodeReason,
      },
      transactionHash
    );

    return appendEventToEventStream(orderSwapEventStream, event);
  }

  orderSwapOpenOnChain(
    orderSwapEventStream: EventStream<OrderSwapEvent>,
    eventPayload: OrderSwapOpenOnChainSuccessEventPayload,
    transactionHash: Hex,
    blockHash: Hex,
    blockSlot: bigint
  ): EventStream<OrderSwapEvent> {
    const {streamId: orderSwapId} = orderSwapEventStream;

    const event = makeOrderSwapDomainEventTransactionOnChain(
      orderSwapId,
      EventTypes.ORDER_SWAP__OPEN_ONCHAIN__SUCCESS,
      eventPayload,
      transactionHash,
      blockHash,
      blockSlot
    );

    return appendEventToEventStream(orderSwapEventStream, event);
  }

  orderSwapPartialFillOnChain(
    orderSwapEventStream: EventStream<OrderSwapEvent>,
    eventPayload: OrderSwapPartialFillOnChainSuccessEventPayload,
    transactionHash: Hex,
    blockHash: Hex,
    blockSlot: bigint
  ): EventStream<OrderSwapEvent> {
    const {streamId: orderSwapId} = orderSwapEventStream;

    const event = makeOrderSwapDomainEventTransactionOnChain(
      orderSwapId,
      EventTypes.ORDER_SWAP__PARTIAL_FILL_ONCHAIN__SUCCESS,
      eventPayload,
      transactionHash,
      blockHash,
      blockSlot
    );

    return appendEventToEventStream(orderSwapEventStream, event);
  }

  orderSwapFinalFillOnChain(
    orderSwapEventStream: EventStream<OrderSwapEvent>,
    eventPayload: OrderSwapFinalFillOnChainSuccessEventPayload,
    transactionHash: Hex,
    blockHash: Hex,
    blockSlot: bigint
  ): EventStream<OrderSwapEvent> {
    const {streamId: orderSwapId} = orderSwapEventStream;

    const event = makeOrderSwapDomainEventTransactionOnChain(
      orderSwapId,
      EventTypes.ORDER_SWAP__FINAL_FILL_ONCHAIN__SUCCESS,
      eventPayload,
      transactionHash,
      blockHash,
      blockSlot
    );

    return appendEventToEventStream(orderSwapEventStream, event);
  }

  orderSwapFillOnChain(
    orderSwapEventStream: EventStream<OrderSwapEvent>,
    eventPayload: OrderSwapFillOnChainSuccessEventPayload,
    transactionHash: Hex,
    blockHash: Hex,
    blockSlot: bigint
  ): EventStream<OrderSwapEvent> {
    const {streamId: orderSwapId} = orderSwapEventStream;

    const event = makeOrderSwapDomainEventTransactionOnChain(
      orderSwapId,
      EventTypes.ORDER_SWAP__FILL_ONCHAIN__SUCCESS,
      eventPayload,
      transactionHash,
      blockHash,
      blockSlot
    );

    return appendEventToEventStream(orderSwapEventStream, event);
  }

  orderSwapCancelInitRequest(
    orderSwapEventStream: EventStream<OrderSwapEvent>,
    eventPayload: OrderSwapCancelInitRequestEventPayload
  ): EventStream<OrderSwapEvent> {
    const {streamId: orderSwapId} = orderSwapEventStream;

    const event = makeOrderSwapDomainEvent(
      orderSwapId,
      EventTypes.ORDER_SWAP__CANCEL_INIT__REQUEST,
      eventPayload
    );

    return appendEventToEventStream(orderSwapEventStream, event);
  }

  orderSwapCancelInit(
    orderSwapEventStream: EventStream<OrderSwapEvent>,
    transactionHash: Hex,
    cancelledOrderSwap: Private.OrderSwap,
    eventPayload: OrderSwapCancelInitSuccessEventPayload
  ): EventStream<OrderSwapEvent> {
    const {orderSwapId} = cancelledOrderSwap;

    const event = makeOrderSwapDomainEventTransaction(
      orderSwapId,
      EventTypes.ORDER_SWAP__CANCEL_INIT__SUCCESS,
      eventPayload,
      transactionHash
    );

    return appendEventToEventStream(orderSwapEventStream, event);
  }

  orderSwapCancelInitFailure(
    orderSwapEventStream: EventStream<OrderSwapEvent>,
    userId: string,
    errorCodeReason: Private.ErrorCodeReason
  ): EventStream<OrderSwapEvent> {
    const {streamId: orderSwapId} = orderSwapEventStream;

    const event = makeOrderSwapDomainEvent(
      orderSwapId,
      EventTypes.ORDER_SWAP__CANCEL_INIT__FAILURE,
      {
        userId,
        orderSwapId,
        ...errorCodeReason,
      }
    );

    return appendEventToEventStream(orderSwapEventStream, event);
  }

  orderSwapCancelSubmit(
    orderSwapEventStream: EventStream<OrderSwapEvent>
  ): EventStream<OrderSwapEvent> {
    const {streamId: orderSwapId, streamEvents: orderSwapEvents} =
      orderSwapEventStream;

    const orderSwapCancelInitEvent =
      getOrderSwapCancelInitSuccessEventOrThrow(orderSwapEvents);

    const {transactionHash} = orderSwapCancelInitEvent;

    const event = makeOrderSwapDomainEventTransaction(
      orderSwapId,
      EventTypes.ORDER_SWAP__CANCEL_SUBMIT__SUCCESS,
      {
        orderSwapId,
      },
      transactionHash
    );

    return appendEventToEventStream(orderSwapEventStream, event);
  }

  orderSwapCancelSubmitFailure(
    orderSwapEventStream: EventStream<OrderSwapEvent>,
    transactionHash: string,
    errorCodeReason: Private.ErrorCodeReason
  ): EventStream<OrderSwapEvent> {
    const {streamId: orderSwapId} = orderSwapEventStream;

    const event = makeOrderSwapDomainEventTransaction(
      orderSwapId,
      EventTypes.ORDER_SWAP__CANCEL_SUBMIT__FAILURE,
      {
        orderSwapId,
        ...errorCodeReason,
      },
      transactionHash
    );

    return appendEventToEventStream(orderSwapEventStream, event);
  }

  orderSwapCancelOnChain(
    orderSwapEventStream: EventStream<OrderSwapEvent>,
    eventPayload: OrderSwapCancelOnChainSuccessEventPayload,
    transactionHash: Hex,
    blockHash: Hex,
    blockSlot: bigint
  ): EventStream<OrderSwapEvent> {
    const {streamId: orderSwapId} = orderSwapEventStream;

    const event = makeOrderSwapDomainEventTransactionOnChain(
      orderSwapId,
      EventTypes.ORDER_SWAP__CANCEL_ONCHAIN__SUCCESS,
      eventPayload,
      transactionHash,
      blockHash,
      blockSlot
    );

    return appendEventToEventStream(orderSwapEventStream, event);
  }

  orderSwapOpenOnChainFailure(
    orderSwapEventStream: EventStream<OrderSwapEvent>,
    eventPayload: OrderSwapOpenOnChainFailureEventPayload
  ): EventStream<OrderSwapEvent> {
    const {streamId: orderSwapId} = orderSwapEventStream;

    const event = makeOrderSwapDomainEvent(
      orderSwapId,
      EventTypes.ORDER_SWAP__OPEN_ONCHAIN__FAILURE,
      eventPayload
    );

    return appendEventToEventStream(orderSwapEventStream, event);
  }

  orderSwapFillOnChainFailure(
    orderSwapEventStream: EventStream<OrderSwapEvent>,
    eventPayload: OrderSwapFillOnChainFailureEventPayload
  ): EventStream<OrderSwapEvent> {
    const {streamId: orderSwapId} = orderSwapEventStream;

    const event = makeOrderSwapDomainEvent(
      orderSwapId,
      EventTypes.ORDER_SWAP__FILL_ONCHAIN__FAILURE,
      eventPayload
    );

    return appendEventToEventStream(orderSwapEventStream, event);
  }

  orderSwapPartialFillOnChainFailure(
    orderSwapEventStream: EventStream<OrderSwapEvent>,
    eventPayload: OrderSwapPartialFillOnChainFailureEventPayload
  ): EventStream<OrderSwapEvent> {
    const {streamId: orderSwapId} = orderSwapEventStream;

    const event = makeOrderSwapDomainEvent(
      orderSwapId,
      EventTypes.ORDER_SWAP__PARTIAL_FILL_ONCHAIN__FAILURE,
      eventPayload
    );

    return appendEventToEventStream(orderSwapEventStream, event);
  }

  orderSwapFinalFillOnChainFailure(
    orderSwapEventStream: EventStream<OrderSwapEvent>,
    eventPayload: OrderSwapFinalFillOnChainFailureEventPayload
  ): EventStream<OrderSwapEvent> {
    const {streamId: orderSwapId} = orderSwapEventStream;

    const event = makeOrderSwapDomainEvent(
      orderSwapId,
      EventTypes.ORDER_SWAP__FINAL_FILL_ONCHAIN__FAILURE,
      eventPayload
    );

    return appendEventToEventStream(orderSwapEventStream, event);
  }

  orderSwapCancelOnChainFailure(
    orderSwapEventStream: EventStream<OrderSwapEvent>,
    eventPayload: OrderSwapCancelOnChainFailureEventPayload
  ): EventStream<OrderSwapEvent> {
    const {streamId: orderSwapId} = orderSwapEventStream;

    const event = makeOrderSwapDomainEvent(
      orderSwapId,
      EventTypes.ORDER_SWAP__CANCEL_ONCHAIN__FAILURE,
      eventPayload
    );

    return appendEventToEventStream(orderSwapEventStream, event);
  }
}
