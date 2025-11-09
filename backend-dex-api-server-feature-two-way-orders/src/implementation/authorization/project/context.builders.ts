import {container} from 'tsyringe';

import {flatMap} from 'lodash';

import {FastifyRequest} from 'fastify';

import {PrismaClient} from '@prisma/client';
import {ContextInput} from '../types';
import * as Private from '~/domain/models/private';

import {
  CountryRepository,
  OrderSaleProjectRepository,
  OrderSaleRepository,
} from '~/domain/repositories';

import {ErrorCode, PublicErrorCode} from '~/domain/errors';
import {ValidationPublicError} from '~/implementation/fastify/error/ValidationError';

import {getProjectRoundInProject} from '~/domain/utils/project.util';

export interface RoundIdRequest {
  roundId: string;
}

export interface OrderIdRequest {
  orderId: string;
}

export interface OrdersSaleContext {
  userOrdersSale: Private.OrderSale[];
}

export interface OrderSaleWithProjectContext {
  orderSaleEntityWithOrderSaleProject: Private.OrderSaleEntityWithOrderSaleProject;
}

export interface OrderSaleProjectContext {
  orderSaleProject: Private.OrderSaleProject;
}

export interface OrderSaleProjectCountryBlacklistContext {
  orderSaleProjectCountryBlacklist: Private.OrderSaleProjectCountryBlacklist[];
}

export interface OrderSaleProjectRoundStatusContext {
  orderSaleProjectRoundStatus: Private.OrderSaleProjectRound;
}

export const isRoundIdPresentInRequest = (
  req: FastifyRequest
): req is FastifyRequest<{Body: RoundIdRequest}> =>
  (req as FastifyRequest<{Body: RoundIdRequest}>)?.body?.roundId !== undefined;

export const isOrderIdPresentInRequest = (
  req: FastifyRequest
): req is FastifyRequest<{
  Params: OrderIdRequest;
}> =>
  (req as FastifyRequest<{Params: OrderIdRequest}>)?.params?.orderId !==
  undefined;

/**
 * Provides country blacklist inside the context
 */
export const orderSaleProjectCountryBlacklistContextBuilder =
  (req: FastifyRequest) =>
  async (
    context: ContextInput<object>
  ): Promise<OrderSaleProjectCountryBlacklistContext> => {
    if (isRoundIdPresentInRequest(req)) {
      const prismaClient = container.resolve<PrismaClient>('PrismaClient');

      const countryRepository =
        container.resolve<CountryRepository>('CountryRepository');

      const orderSaleProjectCountryBlacklist =
        await countryRepository.getOrderSaleProjectCountryBlacklist(
          prismaClient
        );

      return {
        ...(await context),
        orderSaleProjectCountryBlacklist,
      };
    } else {
      throw new ValidationPublicError(
        PublicErrorCode.REQUEST_VALIDATION__MISSING_ROUND_ID
      );
    }
  };

/**
 * Provides project and current statusRound inside the context
 */
export const projectContextBuilder =
  (req: FastifyRequest) =>
  async (
    context: ContextInput<object>
  ): Promise<OrderSaleProjectContext & OrderSaleProjectRoundStatusContext> => {
    if (isRoundIdPresentInRequest(req)) {
      const prismaClient = container.resolve<PrismaClient>('PrismaClient');

      const orderSaleProjectRepository =
        container.resolve<OrderSaleProjectRepository>(
          'OrderSaleProjectRepository'
        );

      const {roundId} = req.body;

      const walletStakeKeyHash = req.user?.walletStakeKeyHash;

      const orderSaleProject =
        await orderSaleProjectRepository.getOrderSaleProjectByRoundId(
          prismaClient,
          roundId,
          walletStakeKeyHash
        );

      if (!orderSaleProject) {
        throw new Error(ErrorCode.PROJECT_NOT_FOUND);
      }

      const round = getProjectRoundInProject(orderSaleProject, roundId);

      return {
        ...(await context),
        orderSaleProject,
        orderSaleProjectRoundStatus: round,
      };
    } else {
      throw new ValidationPublicError(
        PublicErrorCode.REQUEST_VALIDATION__MISSING_ROUND_ID
      );
    }
  };

/**
 * Provides sale order inside the context given project
 */
export const orderSaleContextBuilder =
  (req: FastifyRequest) =>
  async (
    context: ContextInput<{project?: Private.Project}>
  ): Promise<OrdersSaleContext> => {
    if (isRoundIdPresentInRequest(req)) {
      const orderSaleRepository = container.resolve<OrderSaleRepository>(
        'OrderSaleRepository'
      );

      const prismaClient = container.resolve<PrismaClient>('PrismaClient');

      const walletStakeKeyHash = req.user?.walletStakeKeyHash;

      const userProjects = walletStakeKeyHash
        ? await orderSaleRepository.allUserProjectsWithOrdersSaleAndSubmittedTransactionByOwnerWalletStakeKeyHash(
            prismaClient,
            walletStakeKeyHash
          )
        : [];

      const saleOrders = flatMap(userProjects, userProject =>
        flatMap(userProject.round, ({orderSale}) => orderSale)
      );

      return {...(await context), userOrdersSale: saleOrders};
    } else {
      throw new ValidationPublicError(
        PublicErrorCode.REQUEST_VALIDATION__MISSING_ROUND_ID
      );
    }
  };

/**
 * Provides sale order inside the context given project
 */
export const cancellationContextBuilder =
  (req: FastifyRequest) =>
  async (
    context: ContextInput<object>
  ): Promise<OrderSaleWithProjectContext> => {
    if (isOrderIdPresentInRequest(req)) {
      const prismaClient = container.resolve<PrismaClient>('PrismaClient');
      const orderSaleRepository = container.resolve<OrderSaleRepository>(
        'OrderSaleRepository'
      );
      const {orderId} = req.params;
      const orderSaleEntityWithOrderSaleProject =
        await orderSaleRepository.getOrderSaleWithOrderSaleProjectByOrderId(
          prismaClient,
          orderId
        );
      return {
        ...(await context),
        orderSaleEntityWithOrderSaleProject,
      };
    } else {
      throw new ValidationPublicError(
        PublicErrorCode.REQUEST_VALIDATION__MISSING_ORDER_ID
      );
    }
  };
