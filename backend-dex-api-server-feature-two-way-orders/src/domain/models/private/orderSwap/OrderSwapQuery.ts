import {listSwapOrders} from '~/domain/models/public';

export type OrderSwapQuery = NonNullable<Parameters<typeof listSwapOrders>[0]>;
