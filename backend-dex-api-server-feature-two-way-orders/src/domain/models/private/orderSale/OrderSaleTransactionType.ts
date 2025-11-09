import * as Public from '~/domain/models/public';

export const OrderSaleTransactionType: {
  [type in Public.SaleOrderTransactionType]: Public.SaleOrderTransactionType;
} = {
  OPEN: 'OPEN',
  FILL: 'FILL',
  CANCEL: 'CANCEL',
};
