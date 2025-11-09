import {isEmpty, map} from 'lodash';

import * as Prisma from '@prisma/client';

import {Hex} from '~/domain/models/cardano';

import * as Oura from '~/domain/models/oura';
import * as Core from '~/domain/models/core';
import * as Private from '~/domain/models/private';

import {
  TransactionNestedCreate,
  TransactionRepository,
} from '~/domain/repositories';

import {epochInSecondsToDate} from '~/domain/utils/date.util';
import {walletAddressBech32ToHex} from '~/domain/utils/wallet.util';

export class TransactionRepositoryPrisma implements TransactionRepository {
  async getTransactionByTransactionHash(
    prisma: Prisma.Prisma.TransactionClient,
    transactionHash: Hex
  ): Promise<Private.Transaction | null> {
    return await prisma.transaction.findUnique({
      where: {transactionHash},
    });
  }

  async transactionExistsByTxInputHash(
    prisma: Prisma.Prisma.TransactionClient,
    inputTransactionHash: Hex,
    inputIndex: number
  ): Promise<boolean> {
    const existingTransactionInput = await prisma.transactionInput.findMany({
      where: {
        inputIndex,
        inputTransactionHash,
      },
    });
    return !isEmpty(existingTransactionInput);
  }

  async getTransactionOutputByTransactionHashAndScriptAddresses(
    prisma: Prisma.Prisma.TransactionClient,
    scriptAddresses: Hex[],
    transactionOutputHash: Hex
  ): Promise<Prisma.TransactionOutput[]> {
    const transactionOutputs = await prisma.transactionOutput.findMany({
      where: {
        transactionHash: transactionOutputHash,
        address: {in: scriptAddresses},
      },
    });

    return transactionOutputs;
  }

  async getOrSaveTransactionOutput(
    prisma: Prisma.Prisma.TransactionClient,
    transactionHash: Hex,
    transactionOutput: Oura.TransactionOutput,
    transactionOutputIndex: number
  ): Promise<Prisma.TransactionOutput> {
    const savedTransactionOutput =
      (await this.getFirstTransactionOutput(
        prisma,
        transactionHash,
        transactionOutput,
        transactionOutputIndex
      )) ||
      (await this.saveTransactionOutput(
        prisma,
        transactionHash,
        transactionOutput,
        transactionOutputIndex
      ));
    return savedTransactionOutput;
  }

  async getTransactionsByBlockHashes(
    prisma: Prisma.Prisma.TransactionClient,
    blockHashes: Hex[]
  ): Promise<Private.Transaction[]> {
    return prisma.transaction.findMany({
      where: {
        blockHash: {
          in: blockHashes,
        },
      },
    });
  }

  private async getFirstTransactionOutput(
    prisma: Prisma.Prisma.TransactionClient,
    transactionHash: Hex,
    transactionOutput: Oura.TransactionOutput,
    transactionOutputIndex: number
  ): Promise<Prisma.TransactionOutput | null> {
    return await prisma.transactionOutput.findFirst({
      where: {
        index: transactionOutputIndex,
        address: walletAddressBech32ToHex(transactionOutput.address),
        transaction: {
          transactionHash,
        },
      },
    });
  }

  private async saveTransactionOutput(
    prisma: Prisma.Prisma.TransactionClient,
    transactionHash: Hex,
    transactionOutput: Oura.TransactionOutput,
    transactionOutputIndex: number
  ): Promise<Prisma.TransactionOutput> {
    return await prisma.transactionOutput.create({
      data: {
        index: transactionOutputIndex,
        address: walletAddressBech32ToHex(transactionOutput.address),
        transaction: {
          connect: {transactionHash},
        },
      },
    });
  }

  async createTransactionIfNotExists(
    prisma: Prisma.Prisma.TransactionClient,
    {block_hash: blockHash, slot, timestamp}: Oura.EventContext,
    transaction: Oura.Transaction
  ): Promise<Private.Transaction> {
    const {hash: transactionHash, fee: transactionFeeAmount} = transaction;

    const transactionDate = epochInSecondsToDate(timestamp);

    const transactionData = {
      block: {
        connectOrCreate: {
          where: {blockHash},
          create: {blockHash, slot, isRollBack: false},
        },
      },
      transactionHash,
      transactionDate,
      transactionFeeAmount,
    };

    const savedTransaction = await prisma.transaction.upsert({
      where: {transactionHash},
      create: transactionData,
      update: transactionData,
    });

    return savedTransaction;
  }

  createRelatedTransaction(
    unsignedTransaction: Core.Transaction
  ): TransactionNestedCreate {
    return {
      transaction: {
        create: {
          transactionHash: unsignedTransaction.transactionHash,
          transactionFeeAmount: BigInt(
            unsignedTransaction.transactionFeeAmount
          ),
          transactionInput: {
            create: map(
              unsignedTransaction.transactionInputs,
              transactionInput => {
                const {outputIndex, outputTransactionHash, inputIndex} =
                  transactionInput;
                const data = <Prisma.Prisma.TransactionInputCreateInput>{
                  inputIndex,
                  outputIndex,
                  outputTransactionHash,
                };
                return data;
              }
            ),
          },
          transactionOutput: {
            create: map(
              unsignedTransaction.transactionOutputs,
              transactionOutput => {
                const {index, address} = transactionOutput;
                const data = <Prisma.Prisma.TransactionOutputCreateInput>{
                  index,
                  address,
                };
                return data;
              }
            ),
          },
        },
      },
    };
  }

  async getBlocksAfterSlot(
    prisma: Prisma.Prisma.TransactionClient,
    blockSlot: number
  ): Promise<Prisma.Block[]> {
    return prisma.block.findMany({
      where: {
        slot: {
          gt: blockSlot,
        },
      },
    });
  }

  async updateBlock(
    prisma: Prisma.Prisma.TransactionClient,
    data: Prisma.Prisma.BlockUpdateArgs['data'] &
      Prisma.Prisma.BlockUpdateArgs['where']
  ): Promise<Private.Block> {
    const {blockHash} = data;

    const savedBlock = await prisma.block.update({
      where: {blockHash},
      data,
    });

    return savedBlock;
  }

  async updateBlocksAfterSlotWithIsRollBackTrue(
    prisma: Prisma.Prisma.TransactionClient,
    blockSlot: number
  ): Promise<{blocksUpdatedCount: number}> {
    const {count: blocksUpdatedCount} = await prisma.block.updateMany({
      where: {
        slot: {
          gt: blockSlot,
        },
      },
      data: {
        isRollBack: true,
      },
    });

    return Promise.resolve({
      blocksUpdatedCount,
    });
  }

  async createIfNotExistBlockAndConnectTransaction(
    prisma: Prisma.Prisma.TransactionClient,
    {block_hash: blockHash, slot}: Oura.EventContext,
    transactionHash: Hex
  ): Promise<Private.Block | null> {
    const data = {
      slot,
      isRollBack: false,
      transaction: {
        connect: {
          transactionHash,
        },
      },
    };
    const block = await prisma.block.upsert({
      where: {blockHash},
      create: {blockHash, ...data},
      update: data,
    });
    return block;
  }

  async saveSubmittedTransaction(
    prisma: Prisma.Prisma.TransactionClient,
    transaction: Core.Transaction
  ): Promise<Prisma.Transaction> {
    const {
      transactionHash,
      transactionInputs,
      transactionOutputs,
      transactionFeeAmount,
    } = transaction;

    const prismaTransactionInputs = map(
      transactionInputs,
      ({
        inputIndex,
        outputIndex,
        outputTransactionHash,
      }): Prisma.Prisma.TransactionInputCreateManyTransactionInput => ({
        inputIndex,
        outputIndex,
        outputTransactionHash,
      })
    );

    const prismaTransactionOutputs = map(
      transactionOutputs,
      ({
        index,
        address,
      }): Prisma.Prisma.TransactionOutputCreateManyTransactionInput => ({
        index,
        address,
      })
    );

    const transactionCreateInput: Prisma.Prisma.TransactionCreateInput = {
      isSubmitted: true,
      transactionHash,
      transactionFeeAmount: Number(transactionFeeAmount),
      transactionInput: {
        createMany: {data: prismaTransactionInputs},
      },
      transactionOutput: {
        createMany: {data: prismaTransactionOutputs},
      },
    };

    const transactionUpdateInput: Prisma.Prisma.TransactionUpdateInput =
      transactionCreateInput;

    const savedTransaction = await prisma.transaction.upsert({
      where: {transactionHash},
      create: transactionCreateInput,
      update: transactionUpdateInput, // idempotency matters
    });

    return savedTransaction;
  }
}
