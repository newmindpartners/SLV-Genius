import * as Private from '~/domain/models/private';
import {Nullable} from '~/implementation/utils/typescript';

export type OrderSwapFailureEventPayload = Nullable<Private.UserReference> &
  Private.OrderSwapReference &
  Private.ErrorCodeReason;
