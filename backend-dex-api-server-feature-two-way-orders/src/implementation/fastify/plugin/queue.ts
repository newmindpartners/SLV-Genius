import 'reflect-metadata';

import {FastifyInstance, FastifyRequest} from 'fastify';
import fastifyPlugin from 'fastify-plugin';
import {Queue} from 'bullmq';
import {reduce} from 'lodash';
import {ConfigService} from '~/domain/services';
import {getRedisConfig} from '~/implementation/redis/redisClient';
import {InitializedQueueMap} from '~/types';

const requestKey = 'queues';

export enum TransactionSubmitStatus {
  SUBMITTED = 'SUBMITTED',
  QUEUED = 'QUEUED',
  REJECTED = 'REJECTED',
}

//
// HELPERS

const createQueueMQ =
  (config: ConfigService) =>
  (name: string): Queue =>
    new Queue(name, {connection: getRedisConfig(config)});

export const processQueues = (
  queuesToRegister: string[],
  config: ConfigService
): InitializedQueueMap => {
  return reduce(
    queuesToRegister,
    (result, value) => ({
      ...result,
      [value]: createQueueMQ(config)(value),
    }),
    {}
  );
};

//
// FASTIFY QUEUE PLUGIN
export default (initializedQueues: InitializedQueueMap) => {
  return fastifyPlugin(async (fastify: FastifyInstance): Promise<void> => {
    fastify.decorateRequest(requestKey, null);
    fastify.addHook('preHandler', async (req: FastifyRequest) => {
      req[requestKey] = initializedQueues;
    });
  });
};
