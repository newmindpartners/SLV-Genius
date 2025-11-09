import {inject, injectable, singleton} from 'tsyringe';

import {TransactionalContext} from '~/domain/context';

import * as Oura from '~/domain/models/oura';

import {isError} from '~/implementation/utils/typescript';

import {TransactionRepository} from '~/domain/repositories';
import {isRecordNotFound} from '~/implementation/utils/prisma';
import fromUnixTime from 'date-fns/fromUnixTime';
import {LoggerService} from '~/domain/services';

@singleton()
@injectable()
export class BlockOuraEventHandler implements Oura.EventHandler {
  constructor(
    @inject('TransactionRepository')
    private transactionRepository: TransactionRepository,
    @inject('LoggerService')
    private readonly loggerService: LoggerService
  ) {}

  getEventHandlerMap(): Oura.HandlerFunctionMap<Oura.Event> {
    return {
      BlockEnd: [this.updateBlockIfExists.bind(this)],
    };
  }

  /**
   * Add additional block meta data if block exists
   */
  private async updateBlockIfExists(
    context: TransactionalContext,
    event: Oura.Event
  ) {
    if (Oura.isBlockEvent(event)) {
      const {
        context: {timestamp},
        block_end: {
          hash: blockHash,
          number,
          epoch,
          slot,
          previous_hash: previousHash,
        },
      } = event;

      /**
       * Oura is returning seconds instead of milliseconds, but in case that ever changes
       * this function will let us know.
       *
       * Basing this logic on the length of timestamp string will work until year 2286.
       */
      if (timestamp.toString().length !== 10) {
        this.loggerService.warning(
          `Oura Block context.timestamp is of unexpected length. Expected 10, got ${
            timestamp.toString().length
          }`
        );
      }

      const slotDate = fromUnixTime(timestamp);

      try {
        this.loggerService.info(
          `func: updateBlockIfExists for block with block_hash ${blockHash} and block_slot ${slot}`
        );

        await this.transactionRepository.updateBlock(context, {
          blockHash,
          number,
          epoch,
          slot,
          previousHash,
          slotDate,
          isRollBack: false,
        });
      } catch (error) {
        // Re-throw if error is not an expected record not found error
        if (!(isError(error) && isRecordNotFound(error))) {
          throw error;
        }
      }
    }
  }
}
