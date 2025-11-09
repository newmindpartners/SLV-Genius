import 'reflect-metadata';
import {LoggerService} from '~/domain/services';

import finalFill from './finalFillExampleOuraTransactionEvent.json';
import * as Oura from '~/domain/models/oura';
import * as Private from '~/domain/models/private';

import {parseTransactionForFinalFillAndCancel} from '~/implementation/event/oura/orderSwap/OrderSwapCancelAndFinalFillOuraEventHandler.utils';

const finalFillEvent = finalFill as Oura.TransactionEvent;

const orderSwapScriptPolicyId =
  'fae686ea8f21d567841d703dea4d4221c2af071a6f2b433ff07c0af2';

const getOrderSwapsByMintAssetId = async (): Promise<{
  [x: string]: Private.OrderSwap | null;
}> => {
  return new Promise(resolve =>
    resolve({
      asset1vzkyu303cggek22sedle2xxc5p5kj9kqndgr0y: {
        valid: 'orderSale',
        utxoReferenceTransactionHash:
          '20e6c2ebde6501f25fc2857985f3f45258f840327c59d40cf047fca31b6d161b',
        utxoReferenceIndex: 0,
      },
    })
  ) as unknown as {
    [x: string]: Private.OrderSwap | null;
  };
};

const getOrderSwapsByMintAssetIdFailToFind = async (): Promise<{
  [x: string]: Private.OrderSwap | null;
}> => {
  return new Promise(resolve =>
    resolve({
      asset1vzkyu303cggek22sedle2xxc5p5kj9kqndgr0y: null,
    })
  ) as unknown as {
    [x: string]: Private.OrderSwap | null;
  };
};

const logger = {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  error: (error: Error, message: string) => {},
  info: () => {},
  warning: () => {},
  debug: () => {},
  trace: () => {},
} as LoggerService;

test('parseTransactionForFinalFillAndCancel - Valid orders', async () => {
  const result = await parseTransactionForFinalFillAndCancel(
    finalFillEvent,
    [orderSwapScriptPolicyId],
    getOrderSwapsByMintAssetId,
    logger
  );

  expect(result).toStrictEqual({
    finalFillOrders: [
      {
        inputIndex: 0,
        utxoReferenceIndex: 0,
        utxoReferenceTransactionHash:
          '20e6c2ebde6501f25fc2857985f3f45258f840327c59d40cf047fca31b6d161b',
        valid: 'orderSale',
      },
    ],
  });
});

test('parseTransactionForFinalFillAndCancel - Fail to find orders', async () => {
  const result = await parseTransactionForFinalFillAndCancel(
    finalFillEvent,
    [orderSwapScriptPolicyId],
    getOrderSwapsByMintAssetIdFailToFind,
    logger
  );

  expect(result).toStrictEqual({});
});
