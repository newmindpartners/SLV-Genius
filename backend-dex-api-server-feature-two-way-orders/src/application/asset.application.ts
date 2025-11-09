import 'reflect-metadata';

import {inject, injectable, singleton} from 'tsyringe';

import * as Public from '~/domain/models/public';
import * as Private from '~/domain/models/private';

import {TransactionalContext} from '~/domain/context';

import {AssetRepository} from '~/domain/repositories';

import {ConfigService, CoreService} from '~/domain/services';

import {filter, flatMap, isUndefined, reduce} from 'lodash';
import {ApplicationError} from './application.error';
import {ErrorCode} from '~/domain/errors';
import Big from 'big.js';
import {CardanoNetwork} from '~/domain/models/cardano';

@singleton()
@injectable()
export class AssetApplication {
  constructor(
    @inject('CoreService')
    private readonly coreService: CoreService,

    @inject('AssetRepository')
    private readonly assetRepository: AssetRepository,

    @inject('ConfigService')
    private readonly configService: ConfigService
  ) {}

  async getAssetCirculatingSupply(
    context: TransactionalContext,
    assetId: string
  ): Promise<Public.CirculatingSupply> {
    const cardanoNetwork = this.configService.getCardanoNetwork();

    const assetMap =
      cardanoNetwork === CardanoNetwork.PREPROD
        ? Private.ASSET_TREASURY_MAP_PREPROD
        : Private.ASSET_TREASURY_MAP_MAINNET;

    const assetTreasuryInfo = assetMap[assetId];

    if (isUndefined(assetTreasuryInfo)) {
      throw new ApplicationError(ErrorCode.ASSET_NOT_FOUND);
    }

    const {treasuryAddresses, totalSupply} = assetTreasuryInfo;

    const asset = await this.assetRepository.getAssetByAssetId(
      context,
      assetId
    );

    const {policyId} = asset;

    const treasuryAssets = await this.coreService.getAssetsOnAddresses(
      treasuryAddresses
    );

    const filteredAssets = flatMap(treasuryAssets, assetEntry => {
      return filter(assetEntry.assets, {symbol: policyId});
    });

    const treasurySupplyIndivisble = reduce(
      filteredAssets,
      (acc, {amount}) => acc.add(amount),
      Big(0)
    );

    const treasurySupply = treasurySupplyIndivisble.div(
      Math.pow(10, asset.decimalPrecision)
    );

    const circulatingSupply = totalSupply.minus(treasurySupply);

    return {circulatingSupply: circulatingSupply.toString()};
  }
}
