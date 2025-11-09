import {filter, find, groupBy, includes, map} from 'lodash';
import {pick} from 'lodash/fp';

import * as Core from '~/domain/models/core';
import * as Oura from '~/domain/models/oura';

import * as TO from 'fp-ts/TaskOption';
import {pipe} from 'fp-ts/function';

import {div, times} from '~/domain/utils/math.util';

import {assetId} from '~/domain/utils/asset.util';
import {Rational} from '~/domain/models/cardano';

export const processOrderOutputDatum =
  (
    event: Oura.TransactionEvent,
    orderSwapScriptPolicyId: string,
    getUserId: (parsedDatum: Core.OrderSwapDatum) => Promise<string | null>
  ) =>
  async (output: Oura.TransactionOutput) =>
    pipe(
      TO.Do,
      TO.bind('rawDatum', () =>
        TO.fromNullable(
          find(
            event.transaction.plutus_data,
            datum => datum.datum_hash === output.datum_hash
          ) || output.inline_datum
        )
      ),
      TO.bind('parsedDatum', ({rawDatum}) =>
        TO.fromNullable(Core.mapOrderSwapDatum(rawDatum))
      ),
      TO.bind('userId', ({parsedDatum}) =>
        TO.tryCatch(() => getUserId(parsedDatum))
      ),
      TO.bind(
        'effectiveFromDate',
        ({parsedDatum: {effectiveFromDate}}) => TO.some(effectiveFromDate) // expected optional
      ),
      TO.bind(
        'effectiveUntilDate',
        ({parsedDatum: {effectiveUntilDate}}) => TO.some(effectiveUntilDate) // expected optional
      ),
      TO.bind('mintAssetId', ({parsedDatum: {mintAssetName}}) =>
        TO.fromNullable(assetId(orderSwapScriptPolicyId, mintAssetName))
      ),
      TO.bind(
        'quoteAssetId',
        ({parsedDatum: {quoteAssetPolicyId, quoteAssetAssetName}}) =>
          TO.fromNullable(assetId(quoteAssetPolicyId, quoteAssetAssetName))
      ),
      TO.bind(
        'quoteAssetAmountTotalRemaining',
        ({parsedDatum: {quoteAssetAmount}}) => TO.fromNullable(quoteAssetAmount)
      ),
      TO.bind(
        'quoteAssetOriginalAmount',
        ({parsedDatum: {quoteAssetOriginalAmount}}) =>
          TO.fromNullable(quoteAssetOriginalAmount)
      ),
      TO.bind(
        'baseAssetId',
        ({parsedDatum: {baseAssetPolicyId, baseAssetAssetName}}) =>
          TO.fromNullable(assetId(baseAssetPolicyId, baseAssetAssetName))
      ),
      TO.bind('partialFillsCount', ({parsedDatum: {partialFillsCount}}) =>
        TO.fromNullable(partialFillsCount)
      ),
      TO.bind(
        'makerLovelaceFlatFeeAmount',
        ({parsedDatum: {makerLovelaceFlatFeeAmount}}) =>
          TO.fromNullable(makerLovelaceFlatFeeAmount)
      ),
      TO.bind(
        'takerLovelaceFlatFeeAmount',
        ({parsedDatum: {takerLovelaceFlatFeeAmount}}) =>
          TO.fromNullable(takerLovelaceFlatFeeAmount)
      ),
      TO.bind(
        'makerQuoteAssetFeeAmount',
        ({parsedDatum: {makerQuoteAssetFeeAmount}}) =>
          TO.fromNullable(makerQuoteAssetFeeAmount)
      ),
      TO.bind(
        'baseAssetAmountTotalRemaining',
        ({parsedDatum: {quoteBaseAssetRatio, quoteAssetAmount}}) =>
          TO.fromNullable(
            calcOppositeSwapAmountFromRatioAndKnownAmount(
              quoteBaseAssetRatio,
              quoteAssetAmount
            )
          )
      ),
      // Price is represented in datum in the perspective of a consuming fill (base currency).
      // Inverting the price such that it is correctly representative of the producing order.
      TO.bind(
        'priceRatio',
        ({
          parsedDatum: {
            quoteBaseAssetRatio: {numerator, denominator},
          },
        }) => TO.fromNullable({numerator: denominator, denominator: numerator})
      ),
      TO.bind(
        'price',
        ({
          parsedDatum: {
            quoteBaseAssetRatio: {numerator, denominator},
          },
        }) => TO.fromNullable(div(denominator.toString(), numerator.toString()))
      ),
      TO.map(
        pick([
          'userId',
          'mintAssetId',
          'baseAssetId',
          'baseAssetAmountTotalRemaining',
          'quoteAssetId',
          'quoteAssetAmountTotalRemaining',
          'quoteAssetOriginalAmount',
          'effectiveFromDate',
          'effectiveUntilDate',
          'partialFillsCount',
          'makerLovelaceFlatFeeAmount',
          'makerQuoteAssetFeeAmount',
          'takerLovelaceFlatFeeAmount',
          'priceRatio',
          'price',
        ])
      ),
      TO.match(
        () => null,
        result => result
      )
    )();

// Enum
export const orderTypes = {
  newOrders: 'newOrders',
  partialFills: 'partialFills',
} as const;

export type OrderTypes = keyof typeof orderTypes;

// utils - groupBy
export const groupByNewOrderOrPartialFill =
  (event: Oura.TransactionEvent, orderSwapScriptPolicyIds: string[]) =>
  (outputs: Oura.TransactionOutput[]) =>
    groupBy(
      outputs,
      categorizeGroupByNewOrderOrPartialFill(
        event.transaction,
        orderSwapScriptPolicyIds
      )
    );

// utils - groupBy categorizers
export const categorizeGroupByNewOrderOrPartialFill =
  (transaction: Oura.Transaction, orderSwapScriptPolicyIds: string[]) =>
  (output: Oura.TransactionOutput): OrderTypes =>
    isNftMinted(transaction, orderSwapScriptPolicyIds)(output)
      ? orderTypes.newOrders
      : orderTypes.partialFills;

// utils - predicates
export const isOutputToScriptAddress =
  (scriptAddresses: string[]) => (output: Oura.TransactionOutput) =>
    scriptAddresses.includes(output.address);

export const isOrderSaleNftPolicyIdPresent =
  (orderSwapScriptPolicyIds: string[]) => (output: Oura.TransactionOutput) =>
    !!findOrderSaleAssetWithNftPolicyId(orderSwapScriptPolicyIds)(output);

export const isNftMinted =
  (transaction: Oura.Transaction, orderSwapScriptPolicyIds: string[]) =>
  (output: Oura.TransactionOutput) => {
    const mint = findMintByPolicyId(
      transaction,
      orderSwapScriptPolicyIds
    )(output);
    return mint?.quantity === 1;
  };

// utils - filters
export const filterOutputsForScriptAddress =
  (scriptAddresses: string[]) => (outputs: Oura.TransactionOutput[]) =>
    filter(outputs, isOutputToScriptAddress(scriptAddresses));

export const filterOutputsByOrderSwapNftPolicyIds =
  (orderSwapScriptPolicyIds: string[]) => (outputs: Oura.TransactionOutput[]) =>
    filter(outputs, isOrderSaleNftPolicyIdPresent(orderSwapScriptPolicyIds));

// utils - finds
export const findOrderSaleAssetWithNftPolicyId =
  (orderSwapScriptPolicyIds: string[]) => (output: Oura.TransactionOutput) =>
    find(output.assets, ({policy}) =>
      includes(orderSwapScriptPolicyIds, policy)
    );

export const findMintByAssetId =
  (transaction: Oura.Transaction) => (mintAssetId: string) =>
    find(transaction.mint, mint => mint.asset === mintAssetId);

export const findMintByPolicyId =
  (transaction: Oura.Transaction, orderSwapScriptPolicyIds: string[]) =>
  (output: Oura.TransactionOutput) => {
    const asset = findOrderSaleAssetWithNftPolicyId(orderSwapScriptPolicyIds)(
      output
    );
    const mint = asset?.asset
      ? findMintByAssetId(transaction)(asset.asset)
      : null;
    return mint;
  };

export const findNftPolicyIdInOutputWithRef = (
  output: Oura.TransactionOutputWithRef,
  orderSwapScriptPolicyIds: string[]
) =>
  find(output.assets, asset => includes(orderSwapScriptPolicyIds, asset.policy))
    ?.policy;

// utils - calc
export const calcOppositeSwapAmountFromRatioAndKnownAmount = (
  assetRatio: Rational,
  knownAssetAmount: bigint
) =>
  assetRatio && knownAssetAmount
    ? BigInt(
        Math.ceil(
          times(
            Number(knownAssetAmount),
            div(Number(assetRatio.numerator), Number(assetRatio.denominator))
          )
        )
      )
    : null;

// map many
export const appendUtxoRef =
  (transaction: Oura.Transaction) => (outputs: Oura.TransactionOutput[]) =>
    map(outputs, (output, index) => ({
      utxoReferenceTransactionHash: transaction.hash,
      utxoReferenceIndex: index,
      ...output,
    }));
