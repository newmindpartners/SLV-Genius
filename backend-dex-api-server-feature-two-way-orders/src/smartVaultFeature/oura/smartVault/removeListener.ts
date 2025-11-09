import {inject, injectable} from 'tsyringe';

import {find, findIndex, flow, map, values, compact, sortBy} from 'lodash';
import * as TO from 'fp-ts/TaskOption';
import * as loFp from 'lodash/fp';
import {groupBy as fpTsGroupBy} from 'fp-ts/NonEmptyArray';
import {pipe} from 'fp-ts/lib/function';

import {TransactionalContext} from '~/domain/context';

import * as Private from '~/domain/models/private';
import * as Oura from '~/domain/models/oura';

import {ConfigService, LoggerService} from '~/domain/services';

import {TransactionRepository} from '~/domain/repositories';

import {devStoreTransactionEvent} from '~/implementation/event/oura/orderSwap/utils';

import {OrderSwapScriptService} from '~/domain/services/orderSwapScript.service';
import {ApplicationError} from '~/application/application.error';
import {ErrorCode} from '~/domain/errors';
import {SmartVaultRepository} from '~/smartVaultFeature/repository/smartVault';
import {
  monadPeakLogErrorOnEmptyKeys,
  isMintBurn,
  isMintOfPolicyIds,
  mintToAssetId,
  cancelPlutusData,
  burnOrderTypes,
  BurnOrderTypeValues,
} from '~/implementation/event/oura/orderSwap/OrderSwapCancelAndFinalFillOuraEventHandler.utils';
import {PlutusRedeemer} from '~/domain/models/oura';
import {SmartVaultApplication} from '~/smartVaultFeature/application/smartVault';

type OnChainEntity = {
  inputIndex: number;
  utxoReferenceTransactionHash: string;
  utxoReferenceIndex: number;
};

// map many
export const appendOrderSwapsWithInputIndex =
  (inputs: Oura.TransactionInput[]) => (entities: OnChainEntity[] | null) =>
    map(entities, entity => ({
      ...entity,
      inputIndex: findIndex(
        inputs,
        ({tx_id, index}) =>
          entity.utxoReferenceTransactionHash === tx_id &&
          entity.utxoReferenceIndex === index
      ),
    }));

export const isCancel =
  (plutusRedeemers: PlutusRedeemer[] | null) =>
  ({inputIndex}: OnChainEntity) =>
    !!find(plutusRedeemers, {
      input_idx: inputIndex,
      purpose: 'spend',
      plutus_data: cancelPlutusData,
    });

// TODO: We added here instead of utils to customized it
// Group by categorizor
export const categorizeGroupByCancelledOrFinalFillOrders =
  (spendPlutusRedeemers: PlutusRedeemer[] | null) =>
  (entity: OnChainEntity) => {
    if (isCancel(spendPlutusRedeemers)(entity))
      return burnOrderTypes.cancelledOrders;
    return burnOrderTypes.unknownOrders;
  };

// Group by
export const groupByCancelledOrFinalFillOrders =
  (spendPlutusRedeemers: PlutusRedeemer[] | null) =>
  (entity: OnChainEntity[]) =>
    fpTsGroupBy(
      categorizeGroupByCancelledOrFinalFillOrders(spendPlutusRedeemers)
    )(entity) as unknown as Record<BurnOrderTypeValues, OnChainEntity>;

const parseTransactionForFinalFillAndCancel = async (
  event: Oura.TransactionEvent,
  orderSwapScriptPolicyIds: string[],
  getSmartVaultsByMintAssetId: (mintAssetIds: string[]) => Promise<{
    [x: string]: Private.SmartVault | undefined;
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
      TO.fromTask(() => getSmartVaultsByMintAssetId(NftBurnsAssetIds))
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

@injectable()
export class SmartVaultCloseOuraEventHandler implements Oura.EventHandler {
  orderSwapScriptVersion: string;
  orderSwapScriptPolicyIds: string[];
  orderSwapScriptAddresses: string[];

  constructor(
    @inject('ConfigService')
    private readonly configService: ConfigService,

    @inject('LoggerService')
    private readonly loggerService: LoggerService,

    @inject('TransactionRepository')
    private readonly transactionRepository: TransactionRepository,

    @inject('SmartVaultApplication')
    private readonly smartVaultApplication: SmartVaultApplication,

    @inject('SmartVaultRepository')
    private readonly smartVaultRepository: SmartVaultRepository,

    @inject('OrderSwapScriptService')
    private readonly orderSwapScriptService: OrderSwapScriptService
  ) {
    this.orderSwapScriptVersion = 'V1';
    this.orderSwapScriptPolicyIds =
      this.orderSwapScriptService.getOrderSwapScriptPolicyIds(
        this.orderSwapScriptVersion
      );
    this.orderSwapScriptAddresses =
      this.orderSwapScriptService.getOrderSwapScriptAddresses(
        this.orderSwapScriptVersion
      );
  }

  getEventHandlerMap(): Oura.HandlerFunctionMap<Oura.Event> {
    return {
      Transaction: [this.transactionEventHandler.bind(this)],
      BlockEnd: [],
      RollBack: [],
    };
  }

  private async transactionEventHandler(
    context: TransactionalContext,
    event: Oura.Event
  ): Promise<void> {
    const {variant} = event;

    switch (variant) {
      case 'Transaction': {
        await this.handleTransactionEvent(context, event);
      }
    }
  }

  private async handleTransactionEvent(
    context: TransactionalContext,
    event: Oura.TransactionEvent
  ): Promise<void> {
    const result = await parseTransactionForFinalFillAndCancel(
      event,
      this.orderSwapScriptPolicyIds,
      this.getSmartVaultsByMintAssetId(context),
      this.loggerService
    );

    if (result) {
      const {cancelledOrders, finalFillOrders, unknownOrders} = result;

      if (cancelledOrders)
        devStoreTransactionEvent(
          this.configService.isDevelopmentEnvironment(),
          'handleOrderSwapCancelOnChainOuraEventHandler',
          event
        );

      if (finalFillOrders)
        devStoreTransactionEvent(
          this.configService.isDevelopmentEnvironment(),
          'handleOrderSwapFinalFillOnChainOuraEventHandler',
          event
        );

      if (unknownOrders)
        throw new ApplicationError(
          ErrorCode.ONCHAIN_EVENT__CRITICAL_FAILED_TO_CATEGORIZE_BURN
        );

      if (cancelledOrders || finalFillOrders)
        await this.transactionRepository.createTransactionIfNotExists(
          context,
          event.context,
          event.transaction
        );

      await Promise.all(
        map(cancelledOrders, this.processCancelledOrders(context, event))
      );

      // await Promise.all(
      //   map(finalFillOrders, this.processFinalFillOrders(context, event))
      // );
    }
  }

  private processCancelledOrders =
    (context: TransactionalContext, event: Oura.TransactionEvent) =>
    async (smartVault: Private.SmartVault) => {
      // this.loggerService.info(`Order Swap Cancelled: ${orderSwap.orderSwapId}`);

      if (smartVault.mintAssetId)
        await this.smartVaultApplication.processSmartVaultCloseOnChain(
          context,
          event,
          smartVault
        );
    };

  /**
   * Curried getSmartVaultsByMintAssetId
   * Return record with keys of the original ids to identify fail to finds
   */
  private getSmartVaultsByMintAssetId =
    (context: TransactionalContext) =>
    async (
      mintAssetIds: string[]
    ): Promise<Record<string, Private.SmartVault | undefined>> => {
      const smartVaults: Private.SmartVault[] =
        await this.smartVaultRepository.getSmartVaultsByMintAssetId(
          context,
          mintAssetIds
        );

      return mintAssetIds.reduce(
        (result, transactionMintAssetId) => ({
          ...result,
          [transactionMintAssetId]: find(
            smartVaults,
            smartVault => smartVault.mintAssetId === transactionMintAssetId
          ),
        }),
        {} as Record<string, Private.SmartVault | undefined>
      );
    };
}
