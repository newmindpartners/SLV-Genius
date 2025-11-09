import {inject, singleton} from 'tsyringe';
import {TransactionalContext} from '~/domain/context';
import * as Public from '~/domain/models/public';
import * as Private from '~/domain/models/private';
import {LiquidityPoolRepository} from '~/domain/repositories/liquidityPool.repository';
import {DomainMapper} from '~/implementation/prisma/domain.mapper';
import {ErrorCode} from '~/domain/errors';

@singleton()
export class LiquidityPoolApplication {
  constructor(
    @inject('LiquidityPoolRepository')
    private readonly liquidityPoolRepository: LiquidityPoolRepository,
    @inject('DomainMapper')
    private readonly domainMapper: DomainMapper
  ) {}

  async getLiquidityPool(
    context: TransactionalContext,
    liquidityPoolId: string
  ): Promise<Public.LiquidityPool> {
    const liquidityPool = await this.liquidityPoolRepository.getLiquidityPool(
      context,
      liquidityPoolId
    );

    if (!liquidityPool) {
      throw new Error(ErrorCode.LIQUIDITY_POOL_NOT_FOUND);
    }

    return this.domainMapper.toPublicLiquidityPool(liquidityPool);
  }

  async getLiquidityPoolByAssets(
    context: TransactionalContext,
    assetIds: string[]
  ): Promise<Public.LiquidityPool> {
    const liquidityPool =
      await this.liquidityPoolRepository.getLiquidityPoolByAssets(
        context,
        assetIds
      );

    if (!liquidityPool) {
      throw new Error(ErrorCode.LIQUIDITY_POOL_NOT_FOUND);
    }

    return this.domainMapper.toPublicLiquidityPool(liquidityPool);
  }

  async listLiquidityPools(
    context: TransactionalContext,
    query: Private.LiquidityPoolQuery
  ): Promise<Private.PaginatedResults<Public.LiquidityPool>> {
    const {results: liquidityPools, ...pagination} =
      await this.liquidityPoolRepository.listLiquidityPools(
        context,
        query,
        true
      );

    const results = await Promise.all(
      liquidityPools.map(liquidityPool =>
        this.domainMapper.toPublicLiquidityPool(liquidityPool)
      )
    );

    return {results, ...pagination};
  }
}
