import {
  find,
  findIndex,
  flow,
  map,
  isEmpty,
  pickBy,
  keys,
  values,
  isNull,
  compact,
  includes,
  sortBy,
} from 'lodash';
import * as loFp from 'lodash/fp';

import * as Private from '~/domain/models/private';
import * as Oura from '~/domain/models/oura';

import * as TO from 'fp-ts/TaskOption';

import {LoggerService} from '~/domain/services';

import {ApplicationError} from '~/application/application.error';

import {ErrorCode} from '~/domain/errors';
import {MintAsset, PlutusRedeemer} from '~/domain/models/oura';
import {assetId} from '~/domain/utils/asset.util';
import {pipe} from 'fp-ts/lib/function';
import {groupBy as fpTsGroupBy} from 'fp-ts/NonEmptyArray';

type OrderSwapWithInputIndex = Private.OrderSwap & {inputIndex: number};

export const monadPeakLogErrorOnEmptyKeys =
  (logger: LoggerService) => (record: Record<string, unknown>) => {
    const emptyKeys = keys(pickBy(record, isNull));
    if (!isEmpty(emptyKeys))
      logger.error(
        new ApplicationError(
          ErrorCode.ONCHAIN_EVENT__CRITICAL_FAILED_TO_FIND_ORDER
        ),
        `NFT assetIds which failed to find ${JSON.stringify(emptyKeys)}`
      );
    return TO.fromNullable(record);
  };

export const parseTransactionForFinalFillAndCancel = async (
  event: Oura.TransactionEvent,
  orderSwapScriptPolicyIds: string[],
  getOrderSwapsByMintAssetId: (mintAssetIds: string[]) => Promise<{
    [x: string]: Private.OrderSwap | null;
  }>,
  logger: LoggerService
) => {
  const {
    transaction: {
      inputs: unsortedInputs,
      mint,
      plutus_redeemers: plutusRedeemers,
    },
  } = event;

  // Oura does not ensure that inputs are provided in the correct order.
  // Order of inputs is determined by the transaction builder.
  // plutusRedeemer input index references will be invalid if not ordered correctly
  const inputsSortBy: Array<keyof Oura.TransactionInput> = ['tx_id', 'index'];
  const sortedInputs = sortBy(unsortedInputs, inputsSortBy);

  return pipe(
    mint,
    flow(
      loFp.filter(isMintOfPolicyIds(orderSwapScriptPolicyIds)),
      loFp.filter(isMintBurn),
      loFp.map(mintToAssetId),
      TO.fromNullable
    ),
    TO.chain(NftBurnsAssetIds =>
      TO.fromTask(() => getOrderSwapsByMintAssetId(NftBurnsAssetIds))
    ),
    TO.chain(monadPeakLogErrorOnEmptyKeys(logger)),
    TO.chain(flow(values, compact, TO.fromNullable)),
    TO.chain(
      flow(appendOrderSwapsWithInputIndex(sortedInputs), TO.fromNullable)
    ),
    TO.chain(
      flow(groupByCancelledOrFinalFillOrders(plutusRedeemers), TO.fromNullable)
    ),
    TO.match(
      () => null,
      result => result
    )
  )();
};

// predicates
export const isMintOfPolicyIds = (policyIds: string[]) => (mint: MintAsset) =>
  includes(policyIds, mint.policy);

export const isMintBurn = (mint: MintAsset) => mint.quantity === -1;

export const isFinalFill =
  (plutusRedeemers: PlutusRedeemer[] | null) =>
  ({inputIndex}: OrderSwapWithInputIndex) =>
    !!find(plutusRedeemers, {
      input_idx: inputIndex,
      purpose: 'spend',
      plutus_data: finalFillPlutusData,
    });

export const isCancel =
  (plutusRedeemers: PlutusRedeemer[] | null) =>
  ({inputIndex}: OrderSwapWithInputIndex) =>
    !!find(plutusRedeemers, {
      input_idx: inputIndex,
      purpose: 'spend',
      plutus_data: cancelPlutusData,
    });

// map single
export const mintToAssetId = ({policy, asset}: MintAsset): string =>
  assetId(policy, asset);

// map many
export const appendOrderSwapsWithInputIndex =
  (inputs: Oura.TransactionInput[]) =>
  (orderSwaps: Private.OrderSwap[] | null) =>
    map(orderSwaps, orderSwap => ({
      ...orderSwap,
      inputIndex: findIndex(
        inputs,
        ({tx_id, index}) =>
          orderSwap.utxoReferenceTransactionHash === tx_id &&
          orderSwap.utxoReferenceIndex === index
      ),
    }));

// enum
export const burnOrderTypes = {
  cancelledOrders: 'cancelledOrders',
  finalFillOrders: 'finalFillOrders',
  unknownOrders: 'unknownOrders',
} as const;
type BurnOrderTypeKeys = keyof typeof burnOrderTypes;
export type BurnOrderTypeValues = (typeof burnOrderTypes)[BurnOrderTypeKeys];

// consts
export const finalFillPlutusData = {constructor: 2, fields: []};
export const cancelPlutusData = {constructor: 0, fields: []};

// Group by categorizor
export const categorizeGroupByCancelledOrFinalFillOrders =
  (spendPlutusRedeemers: PlutusRedeemer[] | null) =>
  (order: OrderSwapWithInputIndex) => {
    if (isFinalFill(spendPlutusRedeemers)(order))
      return burnOrderTypes.finalFillOrders;
    if (isCancel(spendPlutusRedeemers)(order))
      return burnOrderTypes.cancelledOrders;
    return burnOrderTypes.unknownOrders;
  };

// Group by
export const groupByCancelledOrFinalFillOrders =
  (spendPlutusRedeemers: PlutusRedeemer[] | null) =>
  (order: OrderSwapWithInputIndex[]) =>
    fpTsGroupBy(
      categorizeGroupByCancelledOrFinalFillOrders(spendPlutusRedeemers)
    )(order) as unknown as Record<BurnOrderTypeValues, OrderSwapWithInputIndex>;
