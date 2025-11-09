import {inject, injectable, singleton} from 'tsyringe';
import Redis from 'ioredis';
import {ConfigService, LoggerService} from '~/domain/services';
import {Prisma} from '@prisma/client';
import {createPrismaRedisCache} from 'prisma-redis-middleware';
import {ErrorCode} from '~/domain/errors';
import {getRedisConfig} from '../redis/redisClient';

export interface PrismaMiddlewareFactory {
  getPrismaMiddlewareCache(): Prisma.Middleware;
}

@singleton()
@injectable()
export class PrismaMiddlewareFactoryImplementation
  implements PrismaMiddlewareFactory
{
  constructor(
    @inject('ConfigService')
    private readonly configService: ConfigService,

    @inject('LoggerService')
    private readonly loggerService: LoggerService
  ) {}

  getPrismaMiddlewareCache(): Prisma.Middleware {
    const redis = new Redis({
      ...getRedisConfig(this.configService),
    });

    return this.getPrismaMiddlewareCacheRedis(redis);
  }

  getPrismaMiddlewareCacheRedis(redis: Redis): Prisma.Middleware {
    const cacheMiddleware: Prisma.Middleware = createPrismaRedisCache({
      models: [
        {
          model: 'Asset',
          cacheTime: 3600,
          invalidateRelated: ['Asset'],
        },
        {
          model: 'StakingProject',
          cacheTime: 3600,
          invalidateRelated: ['StakingProject'],
        },
        {
          model: 'OrderSaleProject',
          cacheTime: 3600,
          invalidateRelated: ['OrderSaleProject'],
        },
        {
          model: 'OrderSwap',
          cacheTime: 3600,
          invalidateRelated: ['OrderSwap'],
        },
      ],
      storage: {
        type: 'redis',
        options: {
          client: redis,
          invalidation: {referencesTTL: 3600},
          log: this.loggerService,
        },
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      onHit: (key: any) => {
        this.loggerService.debug('hit', key);
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      onMiss: (key: any) => {
        this.loggerService.info('miss', key);
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      onError: (key: any) => {
        this.loggerService.error(
          new Error(ErrorCode.REDIS__ERROR_CACHING_PRISMA_OPERATION),
          'error',
          key
        );
      },
    });
    return cacheMiddleware;
  }
}
