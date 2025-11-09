import {inject, singleton} from 'tsyringe';
import {AbstractQuery} from './abstract.query';
import {PrismaClient} from '@prisma/client';
import {ConfigService} from '~/domain/services';
import {OrderBookApplication} from '~/application/orderBook.application';
import {FastifyRequest} from 'fastify';
import * as Public from '~/domain/models/public';
import {ErrorCode} from '~/domain/errors';
import {ApplicationError} from '~/application/application.error';

@singleton()
export class OrderBookQueryFastify extends AbstractQuery {
  constructor(
    @inject('ConfigService')
    configService: ConfigService,

    @inject('PrismaClient')
    private readonly prisma: PrismaClient,

    @inject('OrderBookApplication')
    private readonly orderBookApplication: OrderBookApplication
  ) {
    super(configService);
  }

  async getOrderBookByAssetPairAssetIds(
    req: FastifyRequest<{Params: {assetPair: string}}>
  ): Promise<Public.OrderBook> {
    const {assetPair} = req.params;
    const assetPairArr = assetPair.split('-');
    const [assetOneId, assetTwoId] = assetPairArr;

    if (
      assetPairArr.length === 2 &&
      typeof assetOneId === 'string' &&
      typeof assetTwoId === 'string'
    ) {
      return this.orderBookApplication.getOrderBookByAssetPairAssetIds(
        this.prisma,
        assetOneId,
        assetTwoId
      );
    } else {
      throw new ApplicationError(
        ErrorCode.REQUEST_VALIDATION__MALFORMED_ASSET_PAIR_REFERENCE
      );
    }
  }
}
