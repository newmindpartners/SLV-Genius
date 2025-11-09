import openOrderExampleOuraTransactionEvent from './openOrderExampleOuraTransactionEvent.json';
import openBaseAssetAdaAssetExampleOuraTransactionEvent from './openBaseAssetAdaAssetExampleOuraTransactionEvent.json';
import openQuoteAssetAdaAssetExampleOuraTransactionEvent from './openQuoteAssetAdaAssetExampleOuraTransactionEvent.json';
import openOrderOmittedWalletStakeKeyHashExampleOuraTransactionEvent from './openOrderOmittedWalletStakeKeyHashExampleOuraTransactionEvent.json';
import openOrderBigUIntExampleOuraTransactionEvent from './openOrderBigUIntExampleOuraTransactionEvent.json';
import openOrderBigNIntExampleOuraTransactionEvent from './openOrderBigNIntExampleOuraTransactionEvent.json';
import partialFillOrderExampleOuraTransactionEvent from './partialFillOrderExampleOuraTransactionEvent.json';
import * as Oura from '~/domain/models/oura';
import {flow, includes, map} from 'lodash';
import {
  appendUtxoRef,
  filterOutputsByOrderSwapNftPolicyIds,
  groupByNewOrderOrPartialFill,
  processOrderOutputDatum,
} from '~/implementation/event/oura/orderSwap/OrderSwapOpenAndPartialFillOuraEventHandler.utils';
import * as Core from '~/domain/models/core';

const getUserId = async ({
  walletStakeKeyHash,
}: Core.OrderSwapDatum): Promise<string | null> => {
  return new Promise(resolve =>
    resolve(
      includes(
        [
          '7a77d120b9e86addc7388dbbb1bd2350490b7d140ab234038632334d',
          '85a04a204fdae47cceb93e093b0e051334c73af508def3ab5d3c301d',
        ],
        walletStakeKeyHash
      )
        ? 'some-uuid'
        : null
    )
  );
};

const process = async (
  orderSwapScriptPolicyId: string,
  event: Oura.TransactionEvent
) => {
  const {newOrders, partialFills} = flow([
    appendUtxoRef(event.transaction), // @IMPORTANT must be first to capture index correctly
    filterOutputsByOrderSwapNftPolicyIds([orderSwapScriptPolicyId]),
    groupByNewOrderOrPartialFill(event, [orderSwapScriptPolicyId]),
  ])(event.transaction.outputs);

  const result = await Promise.all(
    map(
      // Mixed to simplify test code
      [...(newOrders || []), ...(partialFills || [])],
      processOrderOutputDatum(event, orderSwapScriptPolicyId, getUserId)
    )
  );

  return result;
};

test('processOrderOutputDatum OPEN', async () => {
  const orderSwapScriptPolicyId =
    '693ac7bbfc1aeb7475aea732e237ef74f9d846af278890d2e17d00db';
  const event = openOrderExampleOuraTransactionEvent as Oura.TransactionEvent;

  const result = await process(orderSwapScriptPolicyId, event);

  const expected = [
    {
      userId: 'some-uuid',
      mintAssetId: 'asset1sqhw7q9fs68p0rp8ucendthq6a3f4nx2f0xve7',
      baseAssetId: 'asset1uj8fvgvmxm2dqc9fx8njseu7g7sk3paxgf42x7',
      baseAssetAmountTotalRemaining: 22n,
      quoteAssetId: 'asset1t3d0ljrztk6khk5tns3cr90umad40u8gmllcsz',
      quoteAssetAmountTotalRemaining: 110n,
      priceRatio: {
        denominator: 1n,
        numerator: 5n,
      },
      price: 5,
      quoteAssetOriginalAmount: 110n,
      effectiveFromDate: null,
      effectiveUntilDate: null,
      partialFillsCount: 0,
    },
  ];

  // TODO expect(result).toStrictEqual(expected);
});

test('processOrderOutputDatum OPEN ADA base asset', async () => {
  const orderSwapScriptPolicyId =
    '693ac7bbfc1aeb7475aea732e237ef74f9d846af278890d2e17d00db';
  const event =
    openBaseAssetAdaAssetExampleOuraTransactionEvent as Oura.TransactionEvent;

  const result = await process(orderSwapScriptPolicyId, event);

  const expected = [
    {
      baseAssetAmountTotalRemaining: 300000000n,
      baseAssetId: 'asset1xdz4yj4ldwlpsz2yjgjtt9evg9uskm8jrzjwhj',
      effectiveFromDate: null,
      effectiveUntilDate: null,
      mintAssetId: 'asset1a8qcvnk7q09xe6w8zm4uplef2hljycf5smpmpe',
      partialFillsCount: 0,
      quoteAssetAmountTotalRemaining: 900000000n,
      priceRatio: {
        denominator: 1n,
        numerator: 3n,
      },
      price: 3,
      quoteAssetId: 'asset1mvqjrt76g9yxsle3z92ums7snlpg02p274gek4',
      quoteAssetOriginalAmount: 900000000n,
      userId: 'some-uuid',
    },
  ];

  // TODO expect(result).toStrictEqual(expected);
});

test('processOrderOutputDatum OPEN ADA quote asset', async () => {
  const orderSwapScriptPolicyId =
    '693ac7bbfc1aeb7475aea732e237ef74f9d846af278890d2e17d00db';
  const event =
    openQuoteAssetAdaAssetExampleOuraTransactionEvent as Oura.TransactionEvent;

  const result = await process(orderSwapScriptPolicyId, event);

  const expected = [
    {
      baseAssetAmountTotalRemaining: 300000000n,
      baseAssetId: 'asset1mvqjrt76g9yxsle3z92ums7snlpg02p274gek4',
      effectiveFromDate: null,
      effectiveUntilDate: null,
      mintAssetId: 'asset1a8qcvnk7q09xe6w8zm4uplef2hljycf5smpmpe',
      partialFillsCount: 0,
      quoteAssetAmountTotalRemaining: 900000000n,
      priceRatio: {
        denominator: 1n,
        numerator: 3n,
      },
      price: 3,
      quoteAssetId: 'asset1xdz4yj4ldwlpsz2yjgjtt9evg9uskm8jrzjwhj',
      quoteAssetOriginalAmount: 900000000n,
      userId: 'some-uuid',
    },
  ];

  // TODO expect(result).toStrictEqual(expected);
});

test('processOrderOutputDatum OPEN omitted wallet stake key hash', async () => {
  const orderSwapScriptPolicyId =
    '693ac7bbfc1aeb7475aea732e237ef74f9d846af278890d2e17d00db';
  const event =
    openOrderOmittedWalletStakeKeyHashExampleOuraTransactionEvent as Oura.TransactionEvent;

  const result = await process(orderSwapScriptPolicyId, event);

  const expected = [
    {
      userId: null,
      mintAssetId: 'asset1sqhw7q9fs68p0rp8ucendthq6a3f4nx2f0xve7',
      baseAssetId: 'asset1uj8fvgvmxm2dqc9fx8njseu7g7sk3paxgf42x7',
      baseAssetAmountTotalRemaining: 22n,
      quoteAssetId: 'asset1t3d0ljrztk6khk5tns3cr90umad40u8gmllcsz',
      quoteAssetAmountTotalRemaining: 110n,
      priceRatio: {
        denominator: 1n,
        numerator: 5n,
      },
      price: 5,
      quoteAssetOriginalAmount: 110n,
      effectiveFromDate: null,
      effectiveUntilDate: null,
      partialFillsCount: 0,
    },
  ];

  // TODO expect(result).toStrictEqual(expected);
});

test('processOrderOutputDatum OPEN biguint', async () => {
  const orderSwapScriptPolicyId =
    '54debe4542aedd8f1af00828608fde9384bd8bbc729160149ad9880e';
  const event =
    openOrderBigUIntExampleOuraTransactionEvent as unknown as Oura.TransactionEvent;

  const result = await process(orderSwapScriptPolicyId, event);

  const expected = [
    {
      userId: null,
      mintAssetId: 'asset1kzgjqgay5ltcq563pw7gtsr6c0yjaxrra72knt',
      baseAssetId: 'asset1smsxm5tqps8lguepkc0568l9t6r2mcan72090a',
      baseAssetAmountTotalRemaining: 26n,
      quoteAssetId: 'asset1xdz4yj4ldwlpsz2yjgjtt9evg9uskm8jrzjwhj',
      quoteAssetAmountTotalRemaining: 15580306n,
      priceRatio: {
        denominator: 30216175126565n,
        numerator: 18446744073709551616n,
      },
      price: 610492.3603481442,
      quoteAssetOriginalAmount: 40000000n,
      effectiveFromDate: null,
      effectiveUntilDate: null,
      partialFillsCount: 1,
    },
  ];

  // TODO expect(result).toStrictEqual(expected);
});

test('processOrderOutputDatum OPEN bignint', async () => {
  const orderSwapScriptPolicyId =
    '54debe4542aedd8f1af00828608fde9384bd8bbc729160149ad9880e';
  const event =
    openOrderBigNIntExampleOuraTransactionEvent as unknown as Oura.TransactionEvent;

  const result = await process(orderSwapScriptPolicyId, event);

  const expected = [
    {
      userId: null,
      mintAssetId: 'asset1kzgjqgay5ltcq563pw7gtsr6c0yjaxrra72knt',
      baseAssetId: 'asset1smsxm5tqps8lguepkc0568l9t6r2mcan72090a',
      baseAssetAmountTotalRemaining: 23370459n,
      quoteAssetId: 'asset1xdz4yj4ldwlpsz2yjgjtt9evg9uskm8jrzjwhj',
      quoteAssetAmountTotalRemaining: 15580306n,
      priceRatio: {
        denominator: 2999999999999999999999999999999999999999999999999n,
        numerator: 1999999999999999999999999999999999999999999999999n,
      },
      price: 0.6666666666666666,
      quoteAssetOriginalAmount: 40000000n,
      effectiveFromDate: null,
      effectiveUntilDate: null,
      partialFillsCount: 1,
    },
  ];

  // expect(result).toStrictEqual(expected);
});

test('processOrderOutputDatum PARTIAL_FILL', async () => {
  const orderSwapScriptPolicyId =
    '693ac7bbfc1aeb7475aea732e237ef74f9d846af278890d2e17d00db';
  const event =
    partialFillOrderExampleOuraTransactionEvent as unknown as Oura.TransactionEvent;

  const result = await process(orderSwapScriptPolicyId, event);

  const expected = [
    {
      userId: 'some-uuid',
      mintAssetId: 'asset1sqhw7q9fs68p0rp8ucendthq6a3f4nx2f0xve7',
      baseAssetId: 'asset1uj8fvgvmxm2dqc9fx8njseu7g7sk3paxgf42x7',
      baseAssetAmountTotalRemaining: 10n,
      quoteAssetId: 'asset1t3d0ljrztk6khk5tns3cr90umad40u8gmllcsz',
      quoteAssetAmountTotalRemaining: 50n,
      priceRatio: {
        denominator: 1n,
        numerator: 5n,
      },
      price: 5,
      quoteAssetOriginalAmount: 110n,
      effectiveFromDate: null,
      effectiveUntilDate: null,
      partialFillsCount: 2,
    },
  ];

  // TODO expect(result).toStrictEqual(expected);
});
