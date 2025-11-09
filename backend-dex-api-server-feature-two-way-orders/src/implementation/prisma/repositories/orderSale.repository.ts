import {inject, injectable, singleton} from 'tsyringe';

import {find, isEmpty, isNull, keys, last, map, pickBy, reduce} from 'lodash';

import * as Prisma from '@prisma/client';

import {Hex} from '~/domain/models/cardano';

import * as Oura from '~/domain/models/oura';
import * as Core from '~/domain/models/core';
import * as Public from '~/domain/models/public';
import * as Private from '~/domain/models/private';

import {
  OrderSaleRepository,
  TransactionRepository,
} from '~/domain/repositories';

import {ErrorCode} from '~/domain/errors/domain.error';
import {ApplicationError} from '~/application/application.error';
import {PersistenceError} from '~/implementation/prisma/persistence.error';

import {assetId} from '~/domain/utils/asset.util';
import {walletAddressBech32ToStakeKeyHash} from '~/domain/utils/wallet.util';
import {joinTransactionHashAndOutputIndex} from '~/domain/services';

@singleton()
@injectable()
export class OrderSaleRepositoryPrisma implements OrderSaleRepository {
  constructor(
    @inject('TransactionRepository')
    private transactionRepository: TransactionRepository
  ) {}

  async allUserProjectsWithOrdersSaleAndSubmittedTransactionByOwnerWalletStakeKeyHash(
    prisma: Prisma.Prisma.TransactionClient,
    walletStakeKeyHash: string
  ): Promise<Private.OrderSalePortfolioProject[]> {
    const pendingEventCase = {
      transaction: {
        isSubmitted: true,
        AND: {block: null},
      },
    };

    const onChainEventCase = {
      transaction: {
        block: {
          isRollBack: false,
        },
      },
    };

    const filterByEvents = {
      orderSaleEvent: {
        some: {
          OR: [pendingEventCase, onChainEventCase],
        },
      },
    };

    const projectOrderSales = await prisma.orderSaleProject.findMany({
      include: {
        project: {
          include: {
            asset: true,
          },
        },
        round: {
          orderBy: {
            number: 'asc',
          },
          include: {
            orderSale: {
              // Filter included `orders` by user and events
              where: {
                user: {
                  walletStakeKeyHash,
                },
                ...filterByEvents,
              },
              include: {
                orderSaleEvent: {
                  where: {
                    OR: [pendingEventCase, onChainEventCase],
                  },
                  orderBy: {created: 'asc'}, // <-- Order by `created` to get the last event
                  include: {
                    transaction: {
                      include: {
                        transactionInput: true,
                        transactionOutput: true,
                      },
                    },
                  },
                },
              },
            },
            roundWhitelist: {
              where: {
                walletStakeKeyHash,
              },
            },
          },
        },
      },
      // Filter included `order sale projects` by user and events
      where: {
        round: {
          some: {
            orderSale: {
              some: {
                user: {
                  walletStakeKeyHash,
                },
                ...filterByEvents,
              },
            },
          },
        },
      },
    });

    return projectOrderSales;
  }

  async createOrderSaleOpen(
    prisma: Prisma.Prisma.TransactionClient,
    user: Private.User,
    unsignedOrderSale: Public.UnsignedSaleOrder,
    pendingTransaction: Core.Transaction
  ): Promise<Prisma.OrderSaleEvent> {
    const {
      roundId,

      baseAssetId,
      baseAssetAmount,
    } = unsignedOrderSale;

    const {userId} = user;

    const orderSale = await this.saveOrderSale(prisma, userId, roundId);

    const {orderSaleId} = orderSale;

    const orderSaleEvent = await this.saveOrderSaleEventOpen(
      prisma,
      orderSaleId,
      baseAssetId,
      baseAssetAmount,
      pendingTransaction
    );

    return orderSaleEvent;
  }

  async createOrderSaleCancel(
    prisma: Prisma.Prisma.TransactionClient,
    unsignedOrderSale: Public.UnsignedSaleOrder,
    pendingTransaction: Core.Transaction
  ): Promise<Prisma.OrderSaleEvent> {
    const {orderId} = unsignedOrderSale;

    const orderSale = await prisma.orderSale.findUniqueOrThrow({
      where: {orderSaleId: orderId},
      include: {
        orderSaleEvent: {
          include: {
            transaction: {
              include: {
                transactionOutput: true,
              },
            },
          },
        },
      },
    });

    const {baseAssetId, baseAssetAmount} = unsignedOrderSale;

    const {orderSaleId} = orderSale;

    const orderSaleEvent = await this.saveOrderSaleEventCancel(
      prisma,
      orderSaleId,
      baseAssetId,
      baseAssetAmount,
      pendingTransaction
    );

    return orderSaleEvent;
  }

  async existsOrderSaleEventByEventId(
    prisma: Prisma.Prisma.TransactionClient,
    eventId: string
  ): Promise<boolean> {
    const orderSaleEventCount = await prisma.orderSaleEvent.count({
      where: {eventId},
    });
    return orderSaleEventCount > 0;
  }

  async getOrderSaleByOrderId(
    prisma: Prisma.Prisma.TransactionClient,
    orderSaleId: string
  ): Promise<Private.OrderSale> {
    return await prisma.orderSale.findUniqueOrThrow({
      where: {orderSaleId},
      include: {
        user: true,
        round: {
          include: {
            orderSaleProject: {
              include: {
                round: true,
                project: {
                  include: {
                    asset: true,
                  },
                },
              },
            },
          },
        },
        orderSaleEvent: {
          include: {
            transaction: {
              include: {
                transactionInput: true,
                transactionOutput: true,
              },
            },
          },
        },
      },
    });
  }

  async getOrderSaleByEventId(
    prisma: Prisma.Prisma.TransactionClient,
    orderSaleEventId: string
  ): Promise<Private.OrderSale & {orderSaleEvent: Prisma.OrderSaleEvent[]}> {
    const orderSaleEvent = await this.getOrderSaleEventByEventIdOrThrow(
      prisma,
      orderSaleEventId
    );
    return await this.getOrderSaleByOrderEvent(prisma, orderSaleEvent);
  }

  async getOrderSaleCancelReference(
    prisma: Prisma.Prisma.TransactionClient,
    orderId: string,
    scriptAddress: string
  ): Promise<string> {
    const orderSaleEvent = await this.getLastOrderEventOpenIfOrderIsCancellable(
      prisma,
      orderId
    );

    if (orderSaleEvent?.transaction) {
      const transactionOutput = this.getTransactionOutputByAddress(
        orderSaleEvent.transaction,
        scriptAddress
      );

      const {
        index: transactionOutputIndex,
        transactionHash: transactionOutputHash,
      } = transactionOutput;

      return joinTransactionHashAndOutputIndex(
        transactionOutputHash,
        transactionOutputIndex
      );
    } else {
      throw new PersistenceError(ErrorCode.ORDER__TRANSACTION_NOT_FOUND);
    }
  }

  async updateFillTransactionOrders(
    prisma: Prisma.Prisma.TransactionClient,
    eventContext: Oura.EventContext,
    transaction: Oura.Transaction
  ): Promise<void> {
    const {inputs: transactionInputs, outputs: transactionOutputs} =
      transaction;

    for (const transactionInput of transactionInputs) {
      const {tx_id: transactionInputHash} = transactionInput;

      // At most matches 1 order sale, should be a find not findMany
      const orderSales = await this.findOpenOrderSalesForTransactionInput(
        prisma,
        transactionInputHash
      );

      for (const orderSale of orderSales) {
        const {user} = orderSale;
        const {walletStakeKeyHash: userWalletStakeKeyHash} = user;

        // Find user order outputs, returns array of indexes of matched outputs
        const userTransactionOutputIndexes = keys(
          pickBy(transactionOutputs, transactionOutput => {
            const {
              address: transactionOutputAddress,
              datum_hash: transactionOutputDatumHash,
            } = transactionOutput;
            return (
              transactionOutputDatumHash &&
              walletAddressBech32ToStakeKeyHash(transactionOutputAddress) ===
                userWalletStakeKeyHash
            );
          })
        );

        // Find closest output to order
        // Possibility exists to match the same output,
        // but harmless as the values would have to be identical.
        // The outputs share a transition so it is a benign false match.
        // To note, there is actually no method to match order transactions perfectly
        // to fill outputs in the case of multiple orders from a single wallet.
        // At least not that we are currently aware of.
        const closestOutputToOrder = this.findClosestOutputToOrder(
          transactionOutputs,
          userTransactionOutputIndexes,
          orderSale
        );

        if (closestOutputToOrder) {
          await this.updateFillTransactionOrder(
            prisma,
            eventContext,
            orderSale,
            transaction,
            closestOutputToOrder,
            parseInt(closestOutputToOrder.index)
          );
        }
      }
    }
  }

  async saveOrderSaleEventOpen(
    prisma: Prisma.Prisma.TransactionClient,
    orderSaleId: string,
    baseAssetId: string,
    baseAssetAmount: string,
    pendingTransaction: Core.Transaction
  ): Promise<Prisma.OrderSaleEvent> {
    return await prisma.orderSaleEvent.create({
      data: {
        eventType: Prisma.OrderSaleEventType.OPEN,

        baseAssetId,
        baseAssetAmount: BigInt(baseAssetAmount),

        orderSale: {connect: {orderSaleId}},

        // Persist transaction, inputs and outputs
        ...this.transactionRepository.createRelatedTransaction(
          pendingTransaction
        ),
      },
    });
  }

  async saveOrderSaleEventCancel(
    prisma: Prisma.Prisma.TransactionClient,
    orderSaleId: string,
    baseAssetId: string,
    baseAssetAmount: string,
    pendingTransaction: Core.Transaction
  ): Promise<Prisma.OrderSaleEvent> {
    return await prisma.orderSaleEvent.create({
      data: {
        eventType: Prisma.OrderSaleEventType.CANCEL,

        baseAssetId,
        baseAssetAmount: BigInt(baseAssetAmount),

        orderSale: {connect: {orderSaleId}},

        // Persist transaction, inputs and outputs
        ...this.transactionRepository.createRelatedTransaction(
          pendingTransaction
        ),
      },
    });
  }

  async createOrderSaleEventFill(
    prisma: Prisma.Prisma.TransactionClient,
    orderSaleId: string,
    baseAssetId: string,
    baseAssetAmount: string,
    transactionHash: Hex
  ): Promise<Prisma.OrderSaleEvent> {
    return await prisma.orderSaleEvent.create({
      data: {
        eventType: Prisma.OrderSaleEventType.FILL,

        baseAssetId,
        baseAssetAmount: BigInt(baseAssetAmount),

        orderSale: {
          connect: {orderSaleId},
        },

        transaction: {
          connect: {
            transactionHash,
          },
        },
      },
    });
  }

  // helper

  private async getOrderSaleByOrderEvent(
    prisma: Prisma.Prisma.TransactionClient,
    orderSaleEvent: Prisma.OrderSaleEvent
  ): Promise<Private.OrderSale> {
    const {orderSaleId} = orderSaleEvent;

    return await prisma.orderSale.findUniqueOrThrow({
      where: {orderSaleId},
      include: {
        user: true,
        round: {
          include: {
            orderSaleProject: {
              include: {
                round: true,
                project: {
                  include: {
                    asset: true,
                  },
                },
              },
            },
          },
        },
        orderSaleEvent: {
          include: {
            transaction: {
              include: {
                transactionInput: true,
                transactionOutput: true,
              },
            },
          },
        },
      },
    });
  }

  private async getOrderSaleEventByEventIdOrThrow(
    prisma: Prisma.Prisma.TransactionClient,
    eventId: string
  ): Promise<Prisma.OrderSaleEvent> {
    const orderSaleEvent = await prisma.orderSaleEvent.findUniqueOrThrow({
      where: {eventId},
    });

    return orderSaleEvent;
  }

  private async saveOrderSale(
    prisma: Prisma.Prisma.TransactionClient,
    userId: string,
    roundId: string
  ) {
    return await prisma.orderSale.create({
      data: {
        user: {connect: {userId: userId}},
        round: {connect: {roundId: roundId}},
      },
    });
  }

  private async getLastOrderEventOpenIfOrderIsCancellable(
    prisma: Prisma.Prisma.TransactionClient,
    orderSaleId: string
  ): Promise<Private.OrderSaleEvent> {
    const orderSaleEvents = await prisma.orderSaleEvent.findMany({
      where: {orderSaleId, transaction: {block: {isRollBack: false}}},
      orderBy: {created: 'asc'},
      include: {
        transaction: {
          include: {transactionInput: true, transactionOutput: true},
        },
      },
    });

    const filteredOrderSaleEvents = orderSaleEvents.filter(
      event => !!event.transaction
    );

    const lastOrderSaleEvent = last(filteredOrderSaleEvents);
    if (!lastOrderSaleEvent) {
      throw new ApplicationError(ErrorCode.ORDER__TRANSACTION_NOT_FOUND);
    }

    const {eventType: lastEventType} = lastOrderSaleEvent;
    switch (lastEventType) {
      case 'FILL':
        throw new ApplicationError(
          ErrorCode.ORDER__UNEXPECTED_TRANSACTION_TYPE_FILL
        );
      case 'CANCEL':
        throw new ApplicationError(
          ErrorCode.ORDER__UNEXPECTED_TRANSACTION_TYPE_CANCEL
        );
    }

    return lastOrderSaleEvent;
  }

  private getTransactionOutputByAddress(
    transaction: Private.TransactionWithInputsAndOutputs,
    address: string
  ): Prisma.TransactionOutput {
    const transactionOutput = find(
      transaction.transactionOutput,
      transactionOutput => address === transactionOutput.address
    );

    if (transactionOutput) {
      return transactionOutput;
    } else {
      throw new PersistenceError(ErrorCode.ORDER__TRANSACTION_NOT_FOUND);
    }
  }

  private async findOpenOrderSalesForTransactionInput(
    prisma: Prisma.Prisma.TransactionClient,
    inputTransactionHash: string
  ): Promise<Private.OrderSale[]> {
    const orderSales = await prisma.orderSale.findMany({
      where: {
        orderSaleEvent: {
          some: {
            transaction: {
              transactionInput: {some: {inputTransactionHash}},
            },
            eventType: {
              notIn: [
                Prisma.OrderSaleEventType.FILL,
                Prisma.OrderSaleEventType.CANCEL,
              ],
            },
          },
        },
      },
      include: {
        user: true,
        orderSaleEvent: {
          include: {
            transaction: {
              include: {
                transactionInput: true,
                transactionOutput: true,
              },
            },
          },
          orderBy: {
            created: 'asc',
          },
        },
      },
    });

    return orderSales;
  }

  private async updateFillTransactionOrder(
    prisma: Prisma.Prisma.TransactionClient,
    eventContext: Oura.EventContext,
    orderSale: Prisma.OrderSale,
    transaction: Oura.Transaction,
    transactionOutput: Oura.TransactionOutput,
    transactionOutputIndex: number
  ) {
    const {transactionHash} =
      await this.transactionRepository.createTransactionIfNotExists(
        prisma,
        eventContext,
        transaction
      );

    const savedTransactionOutput =
      await this.transactionRepository.getOrSaveTransactionOutput(
        prisma,
        transactionHash,
        transactionOutput,
        transactionOutputIndex
      );

    const {assets: transactionOutputAssets} = transactionOutput;

    const notEmptyTransactionOutputAssets = !isEmpty(transactionOutputAssets);

    if (notEmptyTransactionOutputAssets) {
      for (const transactionOutputAsset of transactionOutputAssets) {
        const baseAssetId = assetId(
          transactionOutputAsset.policy,
          transactionOutputAsset.asset
        );

        const baseAssetAmount = `${transactionOutputAsset.amount}`;

        await this.saveOrderSaleEventFillIfNotExists(
          prisma,
          orderSale,
          baseAssetId,
          baseAssetAmount,
          savedTransactionOutput
        );
      }
    }
  }

  private findClosestOutputToOrder(
    transactionOutputs: Oura.TransactionOutput[],
    userTransactionOutputIndexes: string[],
    orderSale: Private.OrderSale
  ) {
    const userTransactionOutputs = map(userTransactionOutputIndexes, index => ({
      ...transactionOutputs[parseInt(index)],
      index,
    }));

    const orderSaleEventOpen = find(
      orderSale.orderSaleEvent,
      o => o.eventType === 'OPEN'
    );

    if (orderSaleEventOpen) {
      const result = reduce(
        userTransactionOutputs,
        (
          result: (Oura.TransactionOutput & {index: string}) | null,
          value: Oura.TransactionOutput & {index: string}
        ) => {
          // Empty result case, select first as best candidate
          if (isNull(result)) return value;

          const resultAsset = find(
            result.assets,
            o => assetId(o.policy, o.asset) === orderSaleEventOpen.baseAssetId
          );
          const resultDiff =
            Number(orderSaleEventOpen.baseAssetAmount) -
            (resultAsset?.amount || 0);

          const valueAsset = find(
            value.assets,
            o => assetId(o.policy, o.asset) === orderSaleEventOpen.baseAssetId
          );
          const valueDiff =
            Number(orderSaleEventOpen.baseAssetAmount) -
            (valueAsset?.amount || 0);

          // Determine if new value diff to order value is smaller (closer) while not being negative
          return valueDiff >= 0 && valueDiff < resultDiff
            ? value
            : // Skip and return current result as there have been no better matches
              result;
        },
        null
      );

      return result;
    }
    return null; // no open event found for order
  }

  private async saveOrderSaleEventFillIfNotExists(
    prisma: Prisma.Prisma.TransactionClient,
    orderSale: Prisma.OrderSale,
    baseAssetId: string,
    baseAssetAmount: string,
    transactionOutput: Prisma.TransactionOutput
  ) {
    const orderSaleEventsFill = await this.findFillOrderSaleEvents(
      prisma,
      orderSale
    );

    const orderSaleEventNotYetFilled = isEmpty(orderSaleEventsFill);

    if (orderSaleEventNotYetFilled) {
      await this.createOrderSaleEventFill(
        prisma,
        orderSale.orderSaleId,
        baseAssetId,
        baseAssetAmount,
        transactionOutput.transactionHash
      );
    }
  }

  private async findFillOrderSaleEvents(
    prisma: Prisma.Prisma.TransactionClient,
    orderSale: Prisma.OrderSale
  ): Promise<Prisma.OrderSaleEvent[]> {
    return await prisma.orderSaleEvent.findMany({
      where: {
        eventType: Prisma.OrderSaleEventType.FILL,
        orderSaleId: orderSale.orderSaleId,
      },
      orderBy: {created: 'asc'},
    });
  }

  async getOrderSaleWithOrderSaleProjectByOrderId(
    prisma: Prisma.Prisma.TransactionClient,
    orderSaleId: string
  ): Promise<Private.OrderSaleEntityWithOrderSaleProject> {
    return await prisma.orderSale.findUniqueOrThrow({
      where: {orderSaleId},
      include: {
        user: true,
        round: {
          select: {
            orderSaleProject: {
              select: {
                distributionDate: true,
              },
            },
          },
        },
      },
    });
  }
}
