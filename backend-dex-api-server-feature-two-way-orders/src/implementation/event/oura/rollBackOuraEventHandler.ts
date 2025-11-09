import {inject, injectable, singleton} from 'tsyringe';

import {TransactionalContext} from '~/domain/context';

import * as Oura from '~/domain/models/oura';

import {TransactionRepository} from '~/domain/repositories';
import {isRecordNotFound} from '~/implementation/utils/prisma';
import {isError} from '~/implementation/utils/typescript';
import {OrderSwapApplication} from '~/application/orderSwap.application';
import {LoggerService} from '~/domain/services';

@singleton()
@injectable()
export class RollBackOuraEventHandler implements Oura.EventHandler {
  constructor(
    @inject('TransactionRepository')
    private transactionRepository: TransactionRepository,
    @inject('OrderSwapApplication')
    private orderSwapApplication: OrderSwapApplication,
    @inject('LoggerService')
    private readonly loggerService: LoggerService
  ) {}

  getEventHandlerMap(): Oura.HandlerFunctionMap<Oura.Event> {
    return {
      RollBack: [
        this.updateBlocksAffectedByRollBack.bind(this),
        this.updateEventStreamsAffectedByRollBack.bind(this),
      ],
    };
  }

  private async updateBlocksAffectedByRollBack(
    context: TransactionalContext,
    event: Oura.Event
  ) {
    if (Oura.isRollBackEvent(event)) {
      const {
        roll_back: {block_hash: blockHash, block_slot: slot},
      } = event;

      try {
        const {blocksUpdatedCount} =
          await this.transactionRepository.updateBlocksAfterSlotWithIsRollBackTrue(
            context,
            slot
          );

        this.loggerService.info(
          `func: updateBlocksAffectedByRollBack after block with block_hash ${blockHash} and block_slot higher than ${slot}. Amount of block entries in DB updated: ${blocksUpdatedCount}`
        );
      } catch (error) {
        // Re-throw if error is not an expected record not found error
        if (!(isError(error) && isRecordNotFound(error))) {
          throw error;
        }
      }
    }
  }

  /**
   * If an event stream contain an on-chain success event that has now been
   * rolled back, we will update that event stream with sufficient information
   * to capture this rollback.
   */
  private async updateEventStreamsAffectedByRollBack(
    context: TransactionalContext,
    event: Oura.Event
  ): Promise<void> {
    if (Oura.isRollBackEvent(event)) {
      const {
        roll_back: {block_hash: blockHash, block_slot: blockSlot},
      } = event;

      const eventReceivedAt = new Date();

      await this.orderSwapApplication.updateEventStreamsAffectedByRollBack(
        context,
        {
          rollBackBlock: {
            blockHash,
            blockSlot,
          },
          eventReceivedAt,
        }
      );
    }
  }
}
