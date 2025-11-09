/* eslint-disable node/no-unpublished-import */
import {createMock} from 'ts-auto-mock';
import {OrderSaleProjectRound} from '~/domain/models/private';

export const mockRound = (
  roundInput: Partial<OrderSaleProjectRound>
): OrderSaleProjectRound => ({
  ...createMock<OrderSaleProjectRound>(),
  ...roundInput,
});
