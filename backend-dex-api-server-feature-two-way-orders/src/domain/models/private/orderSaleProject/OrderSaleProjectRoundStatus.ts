import * as Public from '~/domain/models/public';

export const OrderSaleProjectRoundStatus: {
  [type in Public.OrderSaleProjectRoundStatus]: Public.OrderSaleProjectRoundStatus;
} = {
  ACTIVE: 'ACTIVE',
  CLOSED: 'CLOSED',
  UPCOMING: 'UPCOMING',
};
