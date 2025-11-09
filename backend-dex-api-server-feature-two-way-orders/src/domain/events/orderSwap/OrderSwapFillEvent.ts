import {
  OrderSwapFillInitRequestEvent,
  OrderSwapFillInitRequestEventV1,
  OrderSwapFillInitRequestEventV2,
} from './OrderSwapFillInitRequestEvent';
import {OrderSwapFillInitFailureEvent} from './OrderSwapFillInitFailureEvent';
import {
  OrderSwapFillInitSuccessEvent,
  OrderSwapFillInitSuccessEventV1,
  OrderSwapFillInitSuccessEventV2,
} from './OrderSwapFillInitSuccessEvent';
import {OrderSwapFillSubmitFailureEvent} from './OrderSwapFillSubmitFailureEvent';
import {OrderSwapFillSubmitSuccessEvent} from './OrderSwapFillSubmitSuccessEvent';
import {
  OrderSwapFillOnChainSuccessEvent,
  OrderSwapFillOnChainSuccessEventV1,
} from './OrderSwapFillOnChainSuccessEvent';
import {OrderSwapFillOnChainFailureEvent} from './OrderSwapFillOnChainFailureEvent';

export type OrderSwapFillEvent =
  | OrderSwapFillInitRequestEvent
  | OrderSwapFillInitRequestEventV1
  | OrderSwapFillInitRequestEventV2
  | OrderSwapFillInitFailureEvent
  | OrderSwapFillInitSuccessEvent
  | OrderSwapFillInitSuccessEventV1
  | OrderSwapFillInitSuccessEventV2
  | OrderSwapFillSubmitFailureEvent
  | OrderSwapFillSubmitSuccessEvent
  | OrderSwapFillOnChainSuccessEvent
  | OrderSwapFillOnChainSuccessEventV1
  | OrderSwapFillOnChainFailureEvent;
