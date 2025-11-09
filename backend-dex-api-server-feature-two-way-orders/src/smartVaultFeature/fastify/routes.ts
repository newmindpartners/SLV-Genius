import {container} from 'tsyringe';

import {FastifyInstance} from 'fastify';

import fastifyPlugin from 'fastify-plugin';

import {
  SmartVaultListSchema,
  SmartVaultOpenSchema,
  SmartVaultDepositSchema,
  SmartVaultStrategyListResultSchema,
  SmartVaultSchema,
  SmartVaultOperationListSchema,
  SmartVaultCloseSchema,
  SmartVaultWithdrawSchema,
  SmartVaultWithdrawEstimateSchema,
} from '~/implementation/fastify/schemas';

import {authorizationHook} from '~/implementation/fastify/hook/authorization';
import {userIsPresentAuthorization} from '~/implementation/authorization/user/rules';
import {SmartVaultListQueryFastify} from '~/smartVaultFeature/fastify/smartVault/query';
import {SmartVaultMutationFastify} from '~/smartVaultFeature/fastify/smartVault/mutation';
import {SmartVaultStrategyQueryFastify} from '~/smartVaultFeature/fastify/smartVaultStrategy/query';
import {isAdaInDepositAssets} from './authorizationChecks/isAdaInDepositAssets';
import {isConnectedDepositAssets} from './authorizationChecks/isConnectedDepositAssets';
import {isDepositAssetsUniqueList} from './authorizationChecks/isDepositAssetsUniqueList';
import {isMinTwoDepositAssets} from './authorizationChecks/isMinTwoDepositAssets';

const smartVaultQuery = container.resolve(SmartVaultListQueryFastify);
const smartVaultMutation = container.resolve(SmartVaultMutationFastify);
const smartVaultStrategyQuery = container.resolve(
  SmartVaultStrategyQueryFastify
);

export default fastifyPlugin(
  async (fastify: FastifyInstance): Promise<void> => {
    fastify.get('/smart-vault', {
      schema: SmartVaultListSchema,
      preHandler: await authorizationHook(userIsPresentAuthorization),
      handler: smartVaultQuery.listSmartVaults.bind(smartVaultQuery),
    });

    fastify.get('/smart-vault/:smartVaultId', {
      schema: SmartVaultSchema,
      preHandler: await authorizationHook(userIsPresentAuthorization),
      handler: smartVaultQuery.getSmartVaultById.bind(smartVaultQuery),
    });

    fastify.get('/smart-vault/:smartVaultId/operation', {
      schema: SmartVaultOperationListSchema,
      preHandler: await authorizationHook(userIsPresentAuthorization),
      handler:
        smartVaultQuery.listSmartVaultOperationsById.bind(smartVaultQuery),
    });

    fastify.post('/smart-vault/open', {
      schema: SmartVaultOpenSchema,
      preHandler: await authorizationHook([
        ...userIsPresentAuthorization,
        isMinTwoDepositAssets,
        isAdaInDepositAssets,
        isConnectedDepositAssets,
        isDepositAssetsUniqueList,
      ]),
      handler: smartVaultMutation.open.bind(smartVaultMutation),
    });

    fastify.post('/smart-vault/deposit', {
      schema: SmartVaultDepositSchema,
      preHandler: await authorizationHook(userIsPresentAuthorization),
      handler: smartVaultMutation.deposit.bind(smartVaultMutation),
    });

    fastify.get('/smart-vault/strategy', {
      schema: SmartVaultStrategyListResultSchema,
      handler: smartVaultStrategyQuery.listStrategies.bind(
        smartVaultStrategyQuery
      ),
    });

    fastify.post('/smart-vault/withdraw', {
      schema: SmartVaultWithdrawSchema,
      preHandler: await authorizationHook(userIsPresentAuthorization),
      handler: smartVaultMutation.withdraw.bind(smartVaultMutation),
    });

    fastify.post('/smart-vault/withdraw/estimate', {
      schema: SmartVaultWithdrawEstimateSchema,
      preHandler: await authorizationHook(userIsPresentAuthorization),
      handler: smartVaultMutation.withdrawEstimate.bind(smartVaultMutation),
    });

    fastify.post('/smart-vault/close', {
      schema: SmartVaultCloseSchema,
      preHandler: await authorizationHook(userIsPresentAuthorization),
      handler: smartVaultMutation.close.bind(smartVaultMutation),
    });
  }
);
