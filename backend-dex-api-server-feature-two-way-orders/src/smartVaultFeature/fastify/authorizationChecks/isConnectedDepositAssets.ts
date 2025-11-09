import {PrismaClient} from '@prisma/client';
import {FastifyRequest} from 'fastify';
import {container} from 'tsyringe';
import {AuthorizationCheck, ContextInput} from '~/implementation/authorization';
import * as Public from '~/domain/models/public';
import * as Private from '~/domain/models/private';
import {AssetRepository} from '~/domain/repositories';
import {TradingPairRepository} from '~/domain/repositories/tradingPair.repository';

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

      const tradingPairRepository = container.resolve<TradingPairRepository>(
        'TradingPairRepository'
      );

      const nonAdaAssetIds = req.body.depositAssets
        .map(asset => asset.assetId)
        .filter(assetId => assetId !== ada.assetId);

      const isDepositedAssetsConnected = await nonAdaAssetIds.reduce(
        async (accP, assetId) => {
          const acc = await accP;

          const adaTradingPair: Private.TradingPair | null =
            await tradingPairRepository.getTradingPairByAssetIdPair(
              prismaClient,
              [assetId, ada.assetId]
            );

          const isConnectedToAda = adaTradingPair !== null;

          return acc && isConnectedToAda;
        },
        Promise.resolve(true)
      );

      return {...(await context), isDepositedAssetsConnected};
    } else {
      throw Error('Stake vault id is not present in request');
    }
  };

export type DepositedAssetsConnectedContext = {
  isDepositedAssetsConnected: boolean;
};

/**
 * Checks that all assets being deposited are interconnected with each other.
 * Ideally we would perform an exhaustive check between the pairs, but this
 * would not be performant, so we make the implicit assumption that ADA must
 * be part of the assets to be deposited, and that all other assets are connected
 * to ADA.
 */
export const isConnectedDepositAssets: AuthorizationCheck<DepositedAssetsConnectedContext> =
  {
    errorCode: 'SMART_VAULT__OPEN__DEPOSIT_ASSETS_NOT_CONNECTED',
    predicate: context => context.isDepositedAssetsConnected,
    requestContextBuilder: [requestContextBuilder],
  };
