import {DomainEvent, DomainEventMinimal} from '../DomainEvent';
import {EventTypes} from '../EventTypes';

import * as Private from '~/domain/models/private';
import * as Public from '~/domain/models/public';

/**
 * Old version of the event, should not be referenced in application code!
 * Only kept around for upcasting purposes.
 */
export type OrderSwapFillInitRequestEventPayloadV1 = {
  userId: string;
  orderId: string;
  baseAssetAmount: string;
  orderType: 'FILL_DIRECT' | 'FILL_BEST_AVAILABLE';
};

export type OrderSwapFillInitRequestEventV1 = DomainEventMinimal<
  OrderSwapFillInitRequestEventPayloadV1,
  typeof eventType,
  1
>;

export type OrderSwapFillInitRequestEventPayloadV2 = {
  userId: string;
  orderSwapReferencesWithAmounts: Array<{
    orderReference: {
      orderId: string;
    };
    baseAssetAmount: {baseAssetAmount: string};
  }>;
  baseAssetAmount: string;
  orderType: 'FILL_DIRECT' | 'FILL_BEST_AVAILABLE';
};

export type OrderSwapFillInitRequestEventV2 = DomainEventMinimal<
  OrderSwapFillInitRequestEventPayloadV2,
  typeof eventType,
  2
>;
/*********************************************************/

export type OrderSwapFillInitRequestEventPayload = {
  orderSwapReferencesWithAmounts: Array<{
    orderReference: Public.OrderReference;
    toAssetAmount: Public.ToAssetAmount['toAssetAmount'];
  }>;
  orderType: Public.SwapOrderFillType;
} & Pick<Private.OrderSwapOpenAndPartialFillBase, 'userId' | 'toAssetAmount'>;

export type OrderSwapFillInitRequestEvent = DomainEventMinimal<
  OrderSwapFillInitRequestEventPayload,
  typeof eventType,
  typeof fillInitRequestEventVersion
>;

const eventType = EventTypes.ORDER_SWAP__FILL_INIT__REQUEST;

export const fillInitRequestEventVersion = 3;

export function isOrderSwapFillInitRequestEvent(
  event: DomainEvent
): event is OrderSwapFillInitRequestEvent {
  return (
    event.eventType === eventType &&
    event.eventVersion === fillInitRequestEventVersion
  );
}
