import 'reflect-metadata';

import {
  configService,
  fastifyConfig,
  loggerService,
} from './server.dependencyContext';

import fastify from 'fastify';
import fastifyCors from '@fastify/cors';
import fastifyHelmet from '@fastify/helmet';
import fastifyBasicAuth from '@fastify/basic-auth';

import {validate} from './implementation/fastify/basicAuthorization';

import fastifyErrors from '~/implementation/fastify/plugin/error';
import fastifyRoutes from '~/implementation/fastify/plugin/routes';
import smartVaultFeatureFastifyRoutes from '~/smartVaultFeature/fastify/routes';
import requestUserDecorator from '~/implementation/fastify/plugin/requestUserDecorator';
import requestQueueDecorator, {
  processQueues,
} from '~/implementation/fastify/plugin/queue';

import {queueName as transactionSubmitQueueName} from '~/queueProcessors/transactionSubmit/consts';
import {fastifyHelmetConfig} from './serverConfigs/fastifyHelmetConfig';
import {fastifyAsyncLocalStorageRequestScoping} from './implementation/fastify/plugin/requestScoping';

async function init(): Promise<void> {
  const initializedQueues = processQueues(
    [transactionSubmitQueueName],
    configService
  );

  const server = await fastify(fastifyConfig.getOptions());
  const allowedOrigins = configService.getAllowedOrigins();

  await server.register(fastifyAsyncLocalStorageRequestScoping);
  await server.register(fastifyCors, {
    origin: allowedOrigins,
  });
  await server.register(fastifyErrors(configService, loggerService));
  await server.register(fastifyBasicAuth, {validate: validate(configService)});
  await server.register(fastifyRoutes);
  await server.register(smartVaultFeatureFastifyRoutes);
  await server.register(requestUserDecorator);
  await server.register(requestQueueDecorator(initializedQueues));
  await server.register(fastifyHelmet, fastifyHelmetConfig);

  const host = configService.getServerHost();
  const port = configService.getServerPort();
  await server.listen({host, port});
}

Promise.all([init()]);
