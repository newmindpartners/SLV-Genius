import 'reflect-metadata';

import * as Prisma from '@prisma/client';

import {TransactionalContext} from '~/domain/context';

import {Hex} from '~/domain/models/cardano';

import * as Core from '~/domain/models/core';
import * as Oura from '~/domain/models/oura';
import * as Private from '~/domain/models/private';

export interface TransactionNestedCreate {
  transaction: {
    create: {
      transactionHash: Hex;
      transactionFeeAmount: bigint;
      transactionInput: {
        create: Prisma.Prisma.TransactionInputCreateInput[];
      };
      transactionOutput: {
        create: Prisma.Prisma.TransactionOutputCreateInput[];
      };
    };
  };
}

export interface TransactionRepository {
  /**
   * Get transaction by transaction hash
   *
   * @param context transactional context
   * @param transactionHash an hash of a transaction
   */
  getTransactionByTransactionHash(
    context: TransactionalContext,
    transactionHash: Hex
  ): Promise<Private.Transaction | null>;

  /**
   * Set block hash in a transaction, if exists a transaction with given hash
   *
   * @param context transactional context
   * @param eventContext event context which contains block details
   * @param transactionHash an hash of a transaction
   */
  createIfNotExistBlockAndConnectTransaction(
    context: TransactionalContext,
    eventContext: Oura.EventContext,
    transactionHash: Hex
  ): Promise<Private.Block | null>;

  /**
   * Transaction Exists by Tx Input Hash
   *
   * @param context transactional context
   * @param transactionInputHash transactional input hash
   * @param transactionInputIndex transactional input index
   **/
  transactionExistsByTxInputHash(
    context: TransactionalContext,
    transactionInputHash: Hex,
    transactionInputIndex: number
  ): Promise<boolean>;

  /**
   * Check if a transaction output exists
   *
   * @param context transactional context
   * @param scriptAddresses list of script addresses
   * @param transactionOutputHash transactional output hash
   */
  getTransactionOutputByTransactionHashAndScriptAddresses(
    context: TransactionalContext,
    scriptAddresses: Hex[],
    transactionOutputHash: Hex
  ): Promise<Prisma.TransactionOutput[]>;

  /**
   * createTransactionIfNotExists
   * @param prisma
   * @param eventContext
   * @param transaction
   */
  createTransactionIfNotExists(
    prisma: TransactionalContext,
    eventContext: Oura.EventContext,
    transaction: Oura.Transaction
  ): Promise<Prisma.Transaction>;

  /**
   * getOrSaveTransactionOutput
   * @param context
   * @param transactionHash
   * @param transactionOutput
   * @param transactionOutputIndex
   */
  getOrSaveTransactionOutput(
    context: TransactionalContext,
    transactionHash: Hex,
    transactionOutput: Oura.TransactionOutput,
    transactionOutputIndex: number
  ): Promise<Prisma.TransactionOutput>;

  getTransactionsByBlockHashes(
    context: TransactionalContext,
    blockHashes: Hex[]
  ): Promise<Private.Transaction[]>;

  /**
   * createRelatedTransaction
   * @param unsignedTransaction
   */
  createRelatedTransaction(
    unsignedTransaction: Core.Transaction
  ): TransactionNestedCreate;

  getBlocksAfterSlot(
    prisma: Prisma.Prisma.TransactionClient,
    blockSlot: number
  ): Promise<Private.Block[]>;

  /**
   * updateBlock
   * @param prisma
   * @param data
   */
  updateBlock(
    prisma: Prisma.Prisma.TransactionClient,
    data: Prisma.Prisma.BlockUpdateArgs['data'] &
      Prisma.Prisma.BlockUpdateArgs['where']
  ): Promise<Private.Block>;

  updateBlocksAfterSlotWithIsRollBackTrue(
    prisma: Prisma.Prisma.TransactionClient,
    blockSlot: number
  ): Promise<{blocksUpdatedCount: number}>;

  saveSubmittedTransaction(
    context: TransactionalContext,
    transaction: Core.Transaction
  ): Promise<Prisma.Transaction>;
}
