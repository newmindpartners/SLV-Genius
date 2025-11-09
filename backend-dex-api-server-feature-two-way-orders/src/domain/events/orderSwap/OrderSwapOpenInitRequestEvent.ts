import {DomainEvent, DomainEventMinimal} from '../DomainEvent';
import {EventTypes} from '../EventTypes';

import * as Public from '~/domain/models/public';
import * as Private from '~/domain/models/private';

/**
 * Old version of the event, should not be referenced in application code!
 * Only kept around for upcasting purposes.
 */
export type OrderSwapOpenInitRequestEventPayloadV1 = {
  userId: string;
  baseAssetId: string;
  baseAssetAmount: string;
  quoteAssetId: string;
  quoteAssetAmount: string;
  fillQuoteAssetCount?: string | undefined;
  effectiveFromDate?: string | undefined;
  effectiveUntilDate?: string | undefined;
  orderType: 'LIMIT' | 'FILL_DIRECT' | 'FILL_BEST_AVAILABLE';
};

export type OrderSwapOpenInitRequestEventV1 = DomainEventMinimal<
  OrderSwapOpenInitRequestEventPayloadV1,
  typeof eventType,
  1
>;
/*********************************************************/

export type OrderSwapOpenInitRequestEventPayload = Private.UserReference &
  Public.SwapOrderData;

export type OrderSwapOpenInitRequestEvent = DomainEventMinimal<
  OrderSwapOpenInitRequestEventPayload,
  typeof eventType,
  typeof openInitRequestEventVersion
>;

const eventType = EventTypes.ORDER_SWAP__OPEN_INIT__REQUEST;

export const openInitRequestEventVersion = 2;

export function isOrderSwapOpenInitRequestEvent(
  event: DomainEvent
): event is OrderSwapOpenInitRequestEvent {
  return (
    eventType === event.eventType &&
    event.eventVersion === openInitRequestEventVersion
  );
}
