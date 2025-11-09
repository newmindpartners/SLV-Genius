import {
  DomainEvent,
  DomainEventTransaction,
  isDomainEventTransaction,
} from '../DomainEvent';
import {EventTypes} from '../EventTypes';

import {find} from 'lodash';

import * as Private from '~/domain/models/private';

import {ErrorCode} from '~/domain/errors';
import {DeepRequired} from '~/implementation/utils/typescript';

/**
 * Old version of the event, should not be referenced in application code!
 * Only kept around for upcasting purposes.
 */
export type OrderSwapOpenInitSuccessEventPayloadV1 = {
  orderSwapId: string;
  userId: string;
  mintAssetId: string;
  makerLovelaceFlatFeeAmount: string;
  makerQuoteAssetFeeAmount: string;
  makerQuoteAssetFeePercent: string;
  transactionFeeAmount: string;
  depositAmount: string;
};

export type OrderSwapOpenInitSuccessEventV1 = DomainEventTransaction<
  OrderSwapOpenInitSuccessEventPayloadV1,
  typeof eventType,
  1
>;
/*********************************************************/

export type OrderSwapOpenInitSuccessEventPayload = DeepRequired<
  Pick<
    Private.OrderSwapOpenAndPartialFillBase,
    | 'orderSwapId'
    | 'userId'
    | 'mintAssetId'
    | 'makerLovelaceFlatFeeAmount'
    | 'makerFromAssetFeeAmount'
    | 'makerFromAssetFeePercent'
    | 'transactionFeeAmount'
    | 'depositAmount'
  >,
  ['userId']
>;

export type OrderSwapOpenInitSuccessEvent = DomainEventTransaction<
  OrderSwapOpenInitSuccessEventPayload,
  typeof eventType,
  typeof openInitSuccessEventVersion
>;

const eventType = EventTypes.ORDER_SWAP__OPEN_INIT__SUCCESS;

export const openInitSuccessEventVersion = 2;

export function isOrderSwapOpenInitSuccessEvent(
  event: DomainEvent
): event is OrderSwapOpenInitSuccessEvent {
  return (
    eventType === event.eventType &&
    event.eventVersion === openInitSuccessEventVersion &&
    isDomainEventTransaction(event)
  );
}

export function getOrderSwapOpenInitSuccessEvent(
  orderSwapEvents: DomainEvent[]
): OrderSwapOpenInitSuccessEvent | undefined {
  return find(orderSwapEvents, isOrderSwapOpenInitSuccessEvent);
}

export function getOrderSwapOpenInitSuccessEventOrThrow(
  orderSwapEvents: DomainEvent[]
): OrderSwapOpenInitSuccessEvent {
  const foundEvent = getOrderSwapOpenInitSuccessEvent(orderSwapEvents);
  if (!foundEvent) {
    throw Error(ErrorCode.ORDER__EVENT_NOT_FOUND);
  }
  return foundEvent;
}
