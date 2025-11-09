import * as Public from '~/domain/models/public';

export const OrderSaleStatus: {
  [type in Public.OrderStatus]: Public.SaleOrderStatus;
} = {
  OPEN: 'OPEN',
  FILL: 'FILL',
  CANCEL: 'CANCEL',
  PARTIAL_FILL: 'PARTIAL_FILL',
};
