import 'reflect-metadata';

import {container} from 'tsyringe';

import {mapValues, split} from 'lodash';

import {Asset, OrderSaleProjectRound} from '~/domain/models/public';

import {
  CliInputsOrderSaleProjectRoundSetPrice,
  OrderSaleProjectRoundSetPrice,
} from '~/domain/models/private';

import {OrderSaleProjectRepository} from '~/domain/repositories';

import {
  configService,
  loggerService,
  prismaClient,
  projectApplication,
} from '../dependencyContext';

type RoundCode = {
  roundCode: `${Asset['shortName']}/${OrderSaleProjectRound['number']}`;
};

export type SetRoundPriceRequest = RoundCode &
  CliInputsOrderSaleProjectRoundSetPrice;

export const setRoundPrice = ({
  roundCode,
  ...setPrice
}: SetRoundPriceRequest) => {
  const orderSaleProjectRepository =
    container.resolve<OrderSaleProjectRepository>('OrderSaleProjectRepository');

  prismaClient.$transaction(async prisma => {
    // find round from "round code"
    const [assetShortName, roundNumber] = split(roundCode, '/');
    const roundId =
      await orderSaleProjectRepository.getRoundIdByAssetShortNameAndNumber(
        prisma,
        assetShortName,
        Number(roundNumber)
      );

    if (roundId) {
      const bigIntSetPrice: OrderSaleProjectRoundSetPrice = mapValues(
        setPrice,
        value => BigInt(value)
      );
      await projectApplication.updateProjectRound(
        prisma,
        roundId,
        bigIntSetPrice
      );
    } else {
      loggerService.error(
        new Error(`Failed to find round with code ${roundCode}`)
      );
    }
  }, configService.getPrismaTransactionOptions());
};
