import {
  DomainEvent,
  EventTypes,
  isOrderSwapEvent,
  OrderSwapEvent,
} from '~/domain/events';
import {upcastCancelEvent} from './CancelEvent';
import {upcastFillEvent} from './FillEvent';
import {upcastFinalFillEvent} from './FinalFill';
import {upcastOpenEvent} from './OpenEvent';
import {upcastPartialFillEvent} from './PartialFillEvent';

export const upcastDomainEvent = (event: DomainEvent): DomainEvent => {
  if (isOrderSwapEvent(event)) {
    return upcastOrderSwapEvent(event);
  } else {
    return event;
  }
};

export const upcastOrderSwapEvent = (event: OrderSwapEvent): OrderSwapEvent => {
  switch (event.eventType) {
    case EventTypes.ORDER_SWAP__OPEN_INIT__REQUEST:
    case EventTypes.ORDER_SWAP__OPEN_INIT__FAILURE:
    case EventTypes.ORDER_SWAP__OPEN_INIT__SUCCESS:
    case EventTypes.ORDER_SWAP__OPEN_SUBMIT__FAILURE:
    case EventTypes.ORDER_SWAP__OPEN_SUBMIT__SUCCESS:
    case EventTypes.ORDER_SWAP__OPEN_ONCHAIN__FAILURE:
    case EventTypes.ORDER_SWAP__OPEN_ONCHAIN__SUCCESS:
      return upcastOpenEvent(event);
    case EventTypes.ORDER_SWAP__CANCEL_INIT__REQUEST:
    case EventTypes.ORDER_SWAP__CANCEL_INIT__FAILURE:
    case EventTypes.ORDER_SWAP__CANCEL_INIT__SUCCESS:
    case EventTypes.ORDER_SWAP__CANCEL_SUBMIT__FAILURE:
    case EventTypes.ORDER_SWAP__CANCEL_SUBMIT__SUCCESS:
    case EventTypes.ORDER_SWAP__CANCEL_ONCHAIN__FAILURE:
    case EventTypes.ORDER_SWAP__CANCEL_ONCHAIN__SUCCESS:
      return upcastCancelEvent(event);
    case EventTypes.ORDER_SWAP__FILL_INIT__REQUEST:
    case EventTypes.ORDER_SWAP__FILL_INIT__FAILURE:
    case EventTypes.ORDER_SWAP__FILL_INIT__SUCCESS:
    case EventTypes.ORDER_SWAP__FILL_SUBMIT__FAILURE:
    case EventTypes.ORDER_SWAP__FILL_SUBMIT__SUCCESS:
    case EventTypes.ORDER_SWAP__FILL_ONCHAIN__FAILURE:
    case EventTypes.ORDER_SWAP__FILL_ONCHAIN__SUCCESS:
      return upcastFillEvent(event);
    case EventTypes.ORDER_SWAP__PARTIAL_FILL_ONCHAIN__FAILURE:
    case EventTypes.ORDER_SWAP__PARTIAL_FILL_ONCHAIN__SUCCESS:
      return upcastPartialFillEvent(event);
    case EventTypes.ORDER_SWAP__FINAL_FILL_ONCHAIN__FAILURE:
    case EventTypes.ORDER_SWAP__FINAL_FILL_ONCHAIN__SUCCESS:
      return upcastFinalFillEvent(event);
    default: {
      /**
       * This type annotation with `never` helps ensure that all event types are handled.
       */
      const unhandledEvent: never = event;

      return unhandledEvent;
    }
  }
};
