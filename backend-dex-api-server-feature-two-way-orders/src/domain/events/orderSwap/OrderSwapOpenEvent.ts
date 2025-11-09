import {OrderSwapOpenOnChainFailureEvent} from '~/domain/events';

import {
  OrderSwapOpenInitSuccessEvent,
  OrderSwapOpenInitSuccessEventV1,
} from './OrderSwapOpenInitSuccessEvent';
import {OrderSwapOpenSubmitFailureEvent} from './OrderSwapOpenSubmitFailureEvent';
import {OrderSwapOpenSubmitSuccessEvent} from './OrderSwapOpenSubmitSuccessEvent';
import {
  OrderSwapOpenInitRequestEvent,
  OrderSwapOpenInitRequestEventV1,
} from './OrderSwapOpenInitRequestEvent';
import {OrderSwapOpenInitFailureEvent} from './OrderSwapOpenInitFailureEvent';
import {
  OrderSwapOpenOnChainSuccessEvent,
  OrderSwapOpenOnChainSuccessEventV1,
  OrderSwapOpenOnChainSuccessEventV2,
} from './OrderSwapOpenOnChainSuccessEvent';

export type OrderSwapOpenEvent =
  | OrderSwapOpenInitRequestEventV1
  | OrderSwapOpenInitRequestEvent
  | OrderSwapOpenInitFailureEvent
  | OrderSwapOpenInitSuccessEventV1
  | OrderSwapOpenInitSuccessEvent
  | OrderSwapOpenSubmitFailureEvent
  | OrderSwapOpenSubmitSuccessEvent
  | OrderSwapOpenOnChainSuccessEventV1
  | OrderSwapOpenOnChainSuccessEventV2
  | OrderSwapOpenOnChainSuccessEvent
  | OrderSwapOpenOnChainFailureEvent;
