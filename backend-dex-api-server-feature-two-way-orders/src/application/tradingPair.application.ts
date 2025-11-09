import {inject, singleton} from 'tsyringe';
import {TransactionalContext} from '~/domain/context';
import * as Public from '~/domain/models/public';
import * as Private from '~/domain/models/private';
import {TradingPairRepository} from '~/domain/repositories/tradingPair.repository';
import {DomainMapper} from '~/implementation/prisma/domain.mapper';

@singleton()
export class TradingPairApplication {
  constructor(
    @inject('TradingPairRepository')
    private readonly tradingPairRepository: TradingPairRepository,
    @inject('DomainMapper')
    private readonly domainMapper: DomainMapper
  ) {}

  async listTradingPairs(
    context: TransactionalContext
  ): Promise<Private.PaginatedResults<Public.TradingPair>> {
    const {results: tradingPairs, ...pagination} =
      await this.tradingPairRepository.listTradingPairs(context);

    const results = tradingPairs.map(tradingPair =>
      this.domainMapper.toPublicTradingPair(tradingPair)
    );

    return {results, ...pagination};
  }
}
