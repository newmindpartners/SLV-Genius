import {PrismaClient} from '@prisma/client';
import {FastifyRequest} from 'fastify';
import {container} from 'tsyringe';
import {AuthorizationCheck, ContextInput} from '~/implementation/authorization';
import * as Public from '~/domain/models/public';
import {AssetRepository} from '~/domain/repositories';

type Body = Pick<Public.SmartVaultOpen, 'depositAssets'>;

const isExpectedBody = (
  req: FastifyRequest
): req is FastifyRequest<{
  Body: Body;
}> => (req as FastifyRequest<{Body: Body}>)?.body?.depositAssets !== undefined;

const requestContextBuilder =
  (req: FastifyRequest) => async (context: ContextInput<object>) => {
    if (isExpectedBody(req)) {
      const prismaClient = container.resolve<PrismaClient>('PrismaClient');

      const assetRepository =
        container.resolve<AssetRepository>('AssetRepository');

      const ada = await assetRepository.getAdaAsset(prismaClient);

      const isAdaInDepositAssets = req.body.depositAssets.some(
        asset => asset.assetId === ada.assetId
      );

      return {...(await context), isAdaInDepositAssets};
    } else {
      throw Error('Stake vault id is not present in request');
    }
  };

export type DepositedAssetsContainAdaContext = {
  isAdaInDepositAssets: boolean;
};

export const isAdaInDepositAssets: AuthorizationCheck<DepositedAssetsContainAdaContext> =
  {
    errorCode: 'SMART_VAULT__OPEN__ADA_NOT_IN_DEPOSIT_ASSETS',
    predicate: context => context.isAdaInDepositAssets,
    requestContextBuilder: [requestContextBuilder],
  };
