import {DomainEventTransaction} from '../DomainEvent';
import {EventTypes} from '../EventTypes';

import * as Private from '~/domain/models/private';

export type OrderSwapCancelSubmitSuccessEventPayload =
  Private.OrderSwapReference;

export type OrderSwapCancelSubmitSuccessEvent = DomainEventTransaction<
  OrderSwapCancelSubmitSuccessEventPayload,
  typeof eventType,
  typeof cancelSubmitSuccessEventVersion
>;

const eventType = EventTypes.ORDER_SWAP__CANCEL_SUBMIT__SUCCESS;

export const cancelSubmitSuccessEventVersion = 1;
