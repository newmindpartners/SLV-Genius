import * as Public from '~/domain/models/public';

export const OrderSwapTransactionType: {
  [type in Public.SwapOrderTransactionType]: Public.SwapOrderTransactionType;
} = {
  OPEN: 'OPEN',
  FILL: 'FILL',
  CANCEL: 'CANCEL',
  PARTIAL_FILL: 'PARTIAL_FILL',
};
