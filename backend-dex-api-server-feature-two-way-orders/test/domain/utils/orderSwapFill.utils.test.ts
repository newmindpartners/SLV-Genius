import {ValidOrderSwapWithEventStream} from '~/domain/models/private';

import * as loFp from 'lodash/fp';
import {appendFilledAmountToFills} from '~/domain/events/orderSwap/OrderSwapFill.utils';
import {isOnChainSuccessEvent} from '~/domain/events/orderSwap/shared/OrderSwapOnChainEvent';
import {
  finalFillOnChainSuccessEventVersion,
  openInitRequestEventVersion,
  openInitSuccessEventVersion,
  openOnChainSuccessEventVersion,
  openSubmitSuccessEventVersion,
  OrderSwapFinalFillOnChainSuccessEvent,
  OrderSwapOpenInitSuccessEvent,
  OrderSwapOpenOnChainSuccessEvent,
  OrderSwapOpenSubmitSuccessEvent,
  OrderSwapPartialFillOnChainSuccessEvent,
  partialFillOnChainSuccessEventVersion,
} from '~/domain/events';

const mockBlock = {
  blockHash: '855b7a228dfd8f1b4829adbd5eed973ae1a6e5fd58d81d559ad0d823c5be19f2',
  blockSlot: BigInt(67880228),
};

const openInitSuccessEvent: OrderSwapOpenInitSuccessEvent = {
  created: new Date('2023-09-05T16:00:06.930Z'),
  streamId: '3c5e31eb-8011-4047-a5a5-846b21cedd84',
  eventId: 'e452b2ac-7083-4f86-b947-05c3cdee3611',
  eventType: 'ORDER_SWAP__OPEN_INIT__SUCCESS',
  eventVersion: openInitSuccessEventVersion,
  eventPayload: {
    userId: '41940045-3ca3-4249-94ed-91c5887e2f8d',
    orderSwapId: '3c5e31eb-8011-4047-a5a5-846b21cedd84',
    mintAssetId: 'asset14fyxchnv4faxhmz3kn39xzrvvhy5z0swdfldwj',
    makerLovelaceFlatFeeAmount: '4321',
    makerFromAssetFeeAmount: '1234',
    makerFromAssetFeePercent: '0.3',
    transactionFeeAmount: '236619',
    depositAmount: '33',
  },
  transactionHash:
    '53c644c270c061d074510aa3cf0f0e14d01cfb77bd87734df0140bd28037c392',
};

const openSubmitSuccessEvent: OrderSwapOpenSubmitSuccessEvent = {
  created: new Date('2023-09-05T16:00:21.485Z'),
  streamId: '3c5e31eb-8011-4047-a5a5-846b21cedd84',
  eventId: 'd3769cd5-388f-45fd-b844-2ca8f9377e19',
  eventType: 'ORDER_SWAP__OPEN_SUBMIT__SUCCESS',
  eventVersion: openSubmitSuccessEventVersion,
  eventPayload: {orderSwapId: '3c5e31eb-8011-4047-a5a5-846b21cedd84'},
  transactionHash:
    '53c644c270c061d074510aa3cf0f0e14d01cfb77bd87734df0140bd28037c392',
};

const openOnChainSuccessEvent: OrderSwapOpenOnChainSuccessEvent = {
  created: new Date('2023-09-05T16:01:18.905Z'),
  streamId: '3c5e31eb-8011-4047-a5a5-846b21cedd84',
  eventId: '1103074f-4517-4d5e-a640-3ade1360227e',
  eventType: 'ORDER_SWAP__OPEN_ONCHAIN__SUCCESS',
  eventVersion: openOnChainSuccessEventVersion,
  eventPayload: {
    userId: '41940045-3ca3-4249-94ed-91c5887e2f8d',
    mintAssetId: 'asset14fyxchnv4faxhmz3kn39xzrvvhy5z0swdfldwj',
    orderType: 'LIMIT',
    toAssetId: 'asset1mvqjrt76g9yxsle3z92ums7snlpg02p274gek4',
    fromAssetId: 'asset1xdz4yj4ldwlpsz2yjgjtt9evg9uskm8jrzjwhj',
    toAssetAmount: '100000000',
    fromAssetAmount: '100000000',
    toAssetAmountTotalRemaining: '100000000',
    fromAssetAmountTotalRemaining: '100000000',
    toAssetAmountTotalFilled: '0',
    fromAssetAmountTotalFilled: '0',
    utxoReferenceTransactionHash:
      '53c644c270c061d074510aa3cf0f0e14d01cfb77bd87734df0140bd28037c392',
    utxoReferenceIndex: 0,
    effectiveFromDate: null,
    effectiveUntilDate: null,
    partialFillCount: 0,
    transactionTimestamp: 54325423542,
    makerLovelaceFlatFeeAmount: '4321',
    makerFromAssetFeeAmount: '1234',
    makerFromAssetFeePercent: '0.3',
    takerLovelaceFlatFeeAmount: '4321',
    transactionFeeAmount: '236619',
    price: 1,
    priceNumerator: '1',
    priceDenominator: '1',
  },
  transactionHash:
    '53c644c270c061d074510aa3cf0f0e14d01cfb77bd87734df0140bd28037c392',
  blockHash: mockBlock.blockHash,
  blockSlot: mockBlock.blockSlot,
};

const partialFillOnChainSuccessEvent1: OrderSwapPartialFillOnChainSuccessEvent =
  {
    created: new Date('2023-09-05T16:05:14.507Z'),
    streamId: '3c5e31eb-8011-4047-a5a5-846b21cedd84',
    eventId: '7a4419c8-f5ee-44a3-bfc8-ae7430ac6dca',
    eventType: 'ORDER_SWAP__PARTIAL_FILL_ONCHAIN__SUCCESS',
    eventVersion: partialFillOnChainSuccessEventVersion,
    eventPayload: {
      userId: '41940045-3ca3-4249-94ed-91c5887e2f8d',
      mintAssetId: 'asset14fyxchnv4faxhmz3kn39xzrvvhy5z0swdfldwj',
      orderType: 'LIMIT',
      toAssetId: 'asset1mvqjrt76g9yxsle3z92ums7snlpg02p274gek4',
      fromAssetId: 'asset1xdz4yj4ldwlpsz2yjgjtt9evg9uskm8jrzjwhj',
      toAssetAmountTotalRemaining: '60000000',
      fromAssetAmountTotalRemaining: '60000000',
      toAssetAmountTotalFilled: '40000000',
      fromAssetAmountTotalFilled: '40000000',
      utxoReferenceTransactionHash:
        'b891580f1ac029493df4030a8ddb665255effce84569d6c90d6d0a7834e8f34a',
      utxoReferenceIndex: 0,
      effectiveFromDate: null,
      effectiveUntilDate: null,
      partialFillCount: 1,
      transactionTimestamp: 54325423542,
      transactionFeeAmount: '236619',
      price: 1,
      priceNumerator: '1',
      priceDenominator: '1',
    },
    transactionHash:
      'b891580f1ac029493df4030a8ddb665255effce84569d6c90d6d0a7834e8f34a',
    blockHash: mockBlock.blockHash,
    blockSlot: mockBlock.blockSlot,
  };

const partialFillOnChainSuccessEvent2: OrderSwapPartialFillOnChainSuccessEvent =
  {
    created: new Date('2023-09-05T16:09:04.240Z'),
    streamId: '3c5e31eb-8011-4047-a5a5-846b21cedd84',
    eventId: 'bcb4b48c-fb32-40ad-ad9f-a754aa21abca',
    eventType: 'ORDER_SWAP__PARTIAL_FILL_ONCHAIN__SUCCESS',
    eventVersion: partialFillOnChainSuccessEventVersion,
    eventPayload: {
      userId: '41940045-3ca3-4249-94ed-91c5887e2f8d',
      mintAssetId: 'asset14fyxchnv4faxhmz3kn39xzrvvhy5z0swdfldwj',
      orderType: 'LIMIT',
      toAssetId: 'asset1mvqjrt76g9yxsle3z92ums7snlpg02p274gek4',
      fromAssetId: 'asset1xdz4yj4ldwlpsz2yjgjtt9evg9uskm8jrzjwhj',
      toAssetAmountTotalRemaining: '18000000',
      fromAssetAmountTotalRemaining: '18000000',
      toAssetAmountTotalFilled: '82000000',
      fromAssetAmountTotalFilled: '82000000',
      utxoReferenceTransactionHash:
        '2a7329ba856d7a259b2687d3595740f7b7591266a0afbd3166f971892cde4d60',
      utxoReferenceIndex: 0,
      effectiveFromDate: null,
      effectiveUntilDate: null,
      partialFillCount: 2,
      transactionTimestamp: 54325423542,
      transactionFeeAmount: '236619',
      price: 1,
      priceNumerator: '1',
      priceDenominator: '1',
    },
    transactionHash:
      '2a7329ba856d7a259b2687d3595740f7b7591266a0afbd3166f971892cde4d60',
    blockHash: mockBlock.blockHash,
    blockSlot: mockBlock.blockSlot,
  };

const finalFillOnChainSuccessEvent: OrderSwapFinalFillOnChainSuccessEvent = {
  created: new Date('2023-09-05T16:11:34.519Z'),
  streamId: '3c5e31eb-8011-4047-a5a5-846b21cedd84',
  eventId: 'f80a4572-e1bb-4484-ae13-21bf8baa16e4',
  eventType: 'ORDER_SWAP__FINAL_FILL_ONCHAIN__SUCCESS',
  eventVersion: finalFillOnChainSuccessEventVersion,
  eventPayload: {
    userId: '41940045-3ca3-4249-94ed-91c5887e2f8d',
    mintAssetId: 'asset14fyxchnv4faxhmz3kn39xzrvvhy5z0swdfldwj',
    orderType: 'LIMIT',
    toAssetId: 'asset1mvqjrt76g9yxsle3z92ums7snlpg02p274gek4',
    fromAssetId: 'asset1xdz4yj4ldwlpsz2yjgjtt9evg9uskm8jrzjwhj',
    toAssetAmountTotalRemaining: '0',
    fromAssetAmountTotalRemaining: '0',
    toAssetAmountTotalFilled: '100000000',
    fromAssetAmountTotalFilled: '100000000',
    partialFillCount: 3,
    transactionTimestamp: 54325423542,
    transactionFeeAmount: '236619',
    price: 1,
    priceNumerator: '1',
    priceDenominator: '1',
  },
  transactionHash:
    '2df338e6f3cb1e6f54dea36a20db4232e07ec738e1dfff420c5690d6ba92f4f2',
  blockHash: mockBlock.blockHash,
  blockSlot: mockBlock.blockSlot,
};
const orderSwapWithEventStream: ValidOrderSwapWithEventStream = {
  orderSwap: {
    orderSwapId: '3c5e31eb-8011-4047-a5a5-846b21cedd84',
    toAssetId: 'asset1mvqjrt76g9yxsle3z92ums7snlpg02p274gek4',
    fromAssetId: 'asset1xdz4yj4ldwlpsz2yjgjtt9evg9uskm8jrzjwhj',
    toAssetAmount: 100000000n,
    fromAssetAmount: 100000000n,
    toAssetAmountTotalRemaining: 0n,
    fromAssetAmountTotalRemaining: 0n,
    toAssetAmountTotalFilled: 100000000n,
    fromAssetAmountTotalFilled: 100000000n,
    price: 1,
    priceNumerator: '1',
    priceDenominator: '1',
    userId: '41940045-3ca3-4249-94ed-91c5887e2f8d',
    orderType: 'LIMIT',
    orderStatus: 'FILLED',
    orderStatusTransactionHash:
      '2df338e6f3cb1e6f54dea36a20db4232e07ec738e1dfff420c5690d6ba92f4f2',
    cancellationTransactionHash:
      '2df338e6f3cb1e6f54dea36a20db4232e07ec738e1dfff420c5690d6ba92f4f2',
    makerLovelaceFlatFeeAmount: 0n,
    makerFromAssetFeeAmount: 0n,
    makerFromAssetFeePercent: 0,
    takerFromAssetFeeAmount: 0n,
    takerFromAssetFeePercent: 0,
    takerLovelaceFlatFeeAmount: 0n,
    transactionFeeAmount: 236619n,
    cancellationTransactionFeeAmount: 236619n,
    created: new Date('2023-09-05T16:00:06.930Z'),
    updated: new Date('2023-09-05T16:11:34.560Z'),
    mintAssetId: 'asset14fyxchnv4faxhmz3kn39xzrvvhy5z0swdfldwj',
    depositAmount: 6000000n,
    utxoReferenceTransactionHash:
      '2a7329ba856d7a259b2687d3595740f7b7591266a0afbd3166f971892cde4d60',
    utxoReferenceIndex: 0,
    effectiveFromDate: null,
    effectiveUntilDate: null,
    partialFillCount: 0,
    orderDate: new Date(),
    transactionDateOpen: null,
    transactionDateFill: null,
    transactionDateFinalFill: null,
    transactionDateCancel: null,
  },
  streamEvents: [
    {
      created: new Date('2023-09-05T16:00:06.930Z'),
      streamId: '3c5e31eb-8011-4047-a5a5-846b21cedd84',
      eventId: '28d80023-0bfa-4322-95a6-df81fd2f125e',
      eventType: 'ORDER_SWAP__OPEN_INIT__REQUEST',
      eventVersion: openInitRequestEventVersion,
      eventPayload: {
        userId: '41940045-3ca3-4249-94ed-91c5887e2f8d',
        orderType: 'LIMIT',
        toAssetId: 'asset1mvqjrt76g9yxsle3z92ums7snlpg02p274gek4',
        fromAssetId: 'asset1xdz4yj4ldwlpsz2yjgjtt9evg9uskm8jrzjwhj',
        toAssetAmount: '100000000',
        fromAssetAmount: '100000000',
        fillFromAssetCount: '3',
      },
    },
    openInitSuccessEvent,
    openSubmitSuccessEvent,
    openOnChainSuccessEvent,
    partialFillOnChainSuccessEvent1,
    partialFillOnChainSuccessEvent2,
    finalFillOnChainSuccessEvent,
  ],
};

const target = [
  {
    ...openOnChainSuccessEvent,
    filledFromAssetAmount: null,
    filledToAssetAmount: null,
  },
  {
    ...partialFillOnChainSuccessEvent1,
    filledFromAssetAmount: '40000000',
    filledToAssetAmount: '40000000',
  },
  {
    ...partialFillOnChainSuccessEvent2,
    filledFromAssetAmount: '42000000',
    filledToAssetAmount: '42000000',
  },
  {
    ...finalFillOnChainSuccessEvent,
    filledFromAssetAmount: '18000000',
    filledToAssetAmount: '18000000',
  },
];

test('appendFilledAmountToFills', () => {
  const {streamEvents, orderSwap} = orderSwapWithEventStream;

  const result = loFp.flow(
    loFp.filter(isOnChainSuccessEvent),
    loFp.orderBy(['streamVersion'], ['asc']), // sort before append fill
    appendFilledAmountToFills(orderSwap) // order sensitive
  )(streamEvents);

  expect(result).toStrictEqual(target);
});
