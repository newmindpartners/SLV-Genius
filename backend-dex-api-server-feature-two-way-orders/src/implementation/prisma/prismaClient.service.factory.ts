import {PrismaClient} from '@prisma/client';
import {inject, injectable} from 'tsyringe';
import {ConfigService, LoggerService} from '~/domain/services';
import {PrismaMiddlewareFactory} from '~/implementation/prisma/prismaMiddleware.service.factory';

@injectable()
export class PrismaClientFactory {
  constructor(
    @inject('ConfigService')
    private readonly configService: ConfigService,

    @inject('LoggerService')
    private readonly loggerService: LoggerService,

    private readonly prismaMiddlewareFactory?: PrismaMiddlewareFactory
  ) {}

  getPrismaClient(): PrismaClient {
    const prismaClient = new PrismaClient(
      this.configService.getPrismaClientOptions()
    );

    if (this.prismaMiddlewareFactory) {
      const prismaMiddlewareCache =
        this.prismaMiddlewareFactory.getPrismaMiddlewareCache();

      prismaClient.$use(prismaMiddlewareCache);
    }

    return prismaClient;
  }
}
