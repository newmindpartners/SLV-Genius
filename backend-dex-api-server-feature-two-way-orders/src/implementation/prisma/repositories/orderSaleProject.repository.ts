import {inject, injectable, singleton} from 'tsyringe';

import {filter, first, flatMap, isEmpty, isUndefined, last, map} from 'lodash';

import {Prisma} from '@prisma/client';

import {Hex} from '~/domain/models/cardano';

import * as Public from '~/domain/models/public';
import * as Private from '~/domain/models/private';

import {DomainMapper} from '~/implementation/prisma/domain.mapper';

import {
  AssetRepository,
  OrderSaleProjectRepository,
} from '~/domain/repositories';

import {ErrorCode} from '~/domain/errors/domain.error';
import {ApplicationError} from '~/application/application.error';

import {now} from '~/domain/utils/date.util';
import {div, toFixed} from '~/domain/utils/math.util';
import {calcUnitMultiplier} from '~/domain/utils/asset.util';

@singleton()
@injectable()
export class OrderSaleProjectRepositoryPrisma
  implements OrderSaleProjectRepository
{
  constructor(
    @inject('DomainMapper')
    private readonly domainMapper: DomainMapper,

    @inject('AssetRepository')
    private readonly assetRepository: AssetRepository
  ) {}

  async getProjectBaseAssets(
    prisma: Prisma.TransactionClient
  ): Promise<Private.Asset[]> {
    const projects = await prisma.project.findMany({
      select: {
        asset: true,
      },
    });

    return map(projects, ({asset}) => asset);
  }

  async getProjectScriptAddresses(
    prisma: Prisma.TransactionClient
  ): Promise<Hex[]> {
    const projectsWithRounds = await prisma.orderSaleProject.findMany({
      include: {
        round: true,
      },
    });

    const projectRounds = flatMap(projectsWithRounds, ({round}) => round);

    const scriptAddresses = projectRounds
      .map(({scriptAddress}) => scriptAddress)
      .filter((scriptAddress): scriptAddress is Hex => null !== scriptAddress);

    return scriptAddresses;
  }

  async getOrderSaleProjectByOrderSaleProjectId(
    prisma: Prisma.TransactionClient,
    orderSaleProjectId: string,
    walletStakeKeyHash?: string,
    webEnabled?: boolean
  ): Promise<Private.OrderSaleProject | null> {
    // WebEnabled (true, false, omitted)
    const webEnabledWhere = !isUndefined(webEnabled) ? {webEnabled} : {};

    const where: Prisma.OrderSaleProjectWhereUniqueInput = {
      orderSaleProjectId,
      ...webEnabledWhere,
    };

    const orderSaleProject = await prisma.orderSaleProject.findFirst({
      where,
      include: {
        project: {
          include: {
            asset: true,
          },
        },
        round: {
          orderBy: {number: 'asc'},
          include: {
            roundWhitelist: {
              where: {
                walletStakeKeyHash,
              },
            },
          },
        },
      },
    });

    return orderSaleProject;
  }

  async getRoundIdByAssetShortNameAndNumber(
    prisma: Prisma.TransactionClient,
    assetShortName: string,
    roundNumber: number
  ): Promise<string | null> {
    const round = await prisma.round.findFirst({
      select: {roundId: true},
      where: {
        number: roundNumber,
        orderSaleProject: {
          project: {asset: {shortName: assetShortName}},
        },
      },
    });

    return round?.roundId || null;
  }

  async getOrderSaleProjectByRoundId(
    prisma: Prisma.TransactionClient,
    roundId: string,
    walletStakeKeyHash?: string
  ): Promise<Private.OrderSaleProject | null> {
    const round = await prisma.round.findUniqueOrThrow({
      where: {roundId},
    });

    const {orderSaleProjectId} = round;

    return await this.getOrderSaleProjectByOrderSaleProjectId(
      prisma,
      orderSaleProjectId,
      walletStakeKeyHash
    );
  }

  async listOrderSaleProjects(
    prisma: Prisma.TransactionClient,
    query: Private.OrderSaleProjectQuery,
    walletStakeKeyHash?: string
  ): Promise<Private.PaginatedResults<Private.OrderSaleProject>> {
    const {orderSaleProject} = prisma;
    const cursorId = 'orderSaleProjectId';

    const allStatus = this.allStatus(query);
    const isActive = this.isActive(query);
    const isClosed = this.isClosed(query);
    const isUpcoming = this.isUpcoming(query);
    const isClosedSaleDate = this.isClosedDate(query);

    const whereStatus: Prisma.OrderSaleProjectWhereInput[] = filter(
      [allStatus, isActive, isClosed, isUpcoming, isClosedSaleDate],
      (condition): condition is Prisma.OrderSaleProjectWhereInput => !!condition
    );

    const where: Prisma.OrderSaleProjectWhereInput | undefined = query.status
      ? {OR: whereStatus}
      : undefined;

    const cursor = query.cursor ? {[cursorId]: query.cursor} : undefined;

    const responsiveTakeDefault = 2 * 3;

    const desiredTakeOrDefault = Number(query.count || responsiveTakeDefault);

    const forwardTake = desiredTakeOrDefault + 1;

    const backwardTake = -forwardTake;

    const count = await orderSaleProject.count({
      where,
    });

    const forwardResults = await orderSaleProject.findMany({
      take: forwardTake,
      where: {...where, webEnabled: true},
      cursor,
      include: {
        project: {
          include: {
            asset: true,
          },
        },
        round: {
          orderBy: {number: 'asc'},
          include: {
            roundWhitelist: {
              where: {
                walletStakeKeyHash,
              },
            },
          },
        },
      },
    });

    const nextResult = last(forwardResults);

    const next = nextResult ? nextResult[cursorId] : undefined;

    const forwardResultsExist = forwardResults.length > forwardTake - 1;

    if (forwardResultsExist) forwardResults.pop();

    const backwardResults = await orderSaleProject.findMany({
      take: backwardTake,
      skip: 1,
      where,
      cursor,
    });

    const prevResult = first(backwardResults);

    const prev = cursor && prevResult ? prevResult[cursorId] : undefined;

    const paginatedResults: Private.PaginatedResults<Private.OrderSaleProject> =
      {
        prev,
        next,
        count,
        results: forwardResults,
      };

    return paginatedResults;
  }

  async updateOrderSaleProjectRoundAmountWithOrderSale(
    prisma: Prisma.TransactionClient,
    saleOrder: Private.OrderSale
  ): Promise<void> {
    const {roundId} = saleOrder;

    const round = await prisma.round.findUniqueOrThrow({where: {roundId}});
    if (!round)
      throw new ApplicationError(ErrorCode.ORDER__INVALID_ROUND_STATUS);

    const adaAsset = await this.assetRepository.getAdaAsset(prisma);

    const {quoteAssetRaisedAmount, baseAssetSubmittedAmount} =
      this.computeProjectDerivedAmounts(round, saleOrder, adaAsset);

    await prisma.round.update({
      where: {roundId},
      data: {
        quoteAssetRaisedAmount,
        baseAssetSubmittedAmount,
      },
    });
  }

  async updateOrderSaleProjectRoundPriceAndScriptAddress(
    prisma: Prisma.TransactionClient,
    projectRound: Private.OrderSaleProjectRound,
    setPrice: Private.OrderSaleProjectRoundSetPrice,
    setScriptAddress: Private.OrderSaleProjectRoundSetScriptAddress
  ): Promise<void> {
    const {roundId} = projectRound;
    const {scriptAddress} = setScriptAddress;
    const {priceUsd, priceLovelace} = setPrice;

    await prisma.round.update({
      where: {roundId},
      data: {
        scriptAddress,
        priceUsd: Number(priceUsd),
        priceLovelace: Number(priceLovelace),
      },
    });
  }

  private computeProjectDerivedAmounts(
    round: Prisma.RoundGetPayload<{}>,
    saleOrder: Private.OrderSale,
    adaAsset: Private.Asset
  ): {quoteAssetRaisedAmount: bigint; baseAssetSubmittedAmount: bigint} {
    const {
      quoteAssetRaisedAmount: currentQuoteAssetRaisedAmount,
      baseAssetSubmittedAmount: currentBaseAssetSubmittedAmount,
    } = round;

    const orderSaleEventOpen = saleOrder.orderSaleEvent.find(
      ({eventType}) => Private.OrderStatus.OPEN === eventType
    );

    if (orderSaleEventOpen) {
      const {priceLovelace} = round;

      const {baseAssetAmount: orderBaseAssetAmount} = orderSaleEventOpen;

      const priceLovelaceOrZero = priceLovelace ? priceLovelace : BigInt(0);

      const orderQuoteAssetAmount = orderBaseAssetAmount * priceLovelaceOrZero;

      const orderQuoteAssetRaisedAmount = BigInt(
        toFixed(
          div(
            Number(orderQuoteAssetAmount),
            calcUnitMultiplier(adaAsset.decimalPrecision)
          )
        )
      );

      const orderBaseAssetSubmittedAmount = orderBaseAssetAmount;

      const operationMultiplier =
        this.getOrderSaleOperationMultiplier(saleOrder);

      const quoteAssetRaisedAmount =
        currentQuoteAssetRaisedAmount +
        operationMultiplier * orderQuoteAssetRaisedAmount;

      const baseAssetSubmittedAmount =
        currentBaseAssetSubmittedAmount +
        operationMultiplier * orderBaseAssetSubmittedAmount;

      return {
        quoteAssetRaisedAmount,
        baseAssetSubmittedAmount,
      };
    } else {
      return {
        quoteAssetRaisedAmount: currentQuoteAssetRaisedAmount,
        baseAssetSubmittedAmount: currentBaseAssetSubmittedAmount,
      };
    }
  }

  private getOrderSaleOperationMultiplier(
    orderSale: Private.OrderSale
  ): bigint {
    const {orderSaleEvent} = orderSale;

    switch (last(orderSaleEvent)?.eventType) {
      case 'OPEN':
        return BigInt(1);
      case 'CANCEL':
        return BigInt(-1);
      default:
        return BigInt(0);
    }
  }

  private allStatus(
    query: Private.OrderSaleProjectQuery
  ): Prisma.OrderSaleProjectWhereInput | null {
    return isEmpty(query.status) ? {...{}} : null;
  }

  private isActive(
    query: Private.OrderSaleProjectQuery
  ): Prisma.OrderSaleProjectWhereInput | null {
    return this.whereStatus(query, Private.OrderSaleProjectRoundStatus.ACTIVE, {
      round: {
        some: {
          endDate: {gte: now()},
          startDate: {lte: now()},
        },
      },
    });
  }

  private isUpcoming(
    query: Private.OrderSaleProjectQuery
  ): Prisma.OrderSaleProjectWhereInput | null {
    return this.whereStatus(
      query,
      Private.OrderSaleProjectRoundStatus.UPCOMING,
      {
        round: {
          every: {
            startDate: {gte: now()},
          },
        },
      }
    );
  }

  private isClosed(
    query: Private.OrderSaleProjectQuery
  ): Prisma.OrderSaleProjectWhereInput | null {
    return this.whereStatus(query, Private.OrderSaleProjectRoundStatus.CLOSED, {
      round: {
        every: {
          isClosed: true,
        },
      },
    });
  }

  private isClosedDate(
    query: Private.OrderSaleProjectQuery
  ): Prisma.OrderSaleProjectWhereInput | null {
    return this.whereStatus(query, Private.OrderSaleProjectRoundStatus.CLOSED, {
      round: {
        every: {
          endDate: {lte: now()},
        },
      },
    });
  }

  private whereStatus(
    query: Private.OrderSaleProjectQuery,
    status: Public.OrderSaleProjectRoundStatus,
    where: Prisma.OrderSaleProjectWhereInput
  ): Prisma.OrderSaleProjectWhereInput | null {
    return query.status?.includes(status) ? where : null;
  }
}
