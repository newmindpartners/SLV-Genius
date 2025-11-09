import * as Private from '~/domain/models/private';
import {Queue} from 'bullmq';

export type InitializedQueueMap = {[queueName: string]: Queue};

// https://www.fastify.io/docs/latest/Reference/TypeScript/#request
declare module 'fastify' {
  interface FastifyRequest {
    user: Private.User | null;
    queues: InitializedQueueMap;
  }
}

declare module 'blake2b';
