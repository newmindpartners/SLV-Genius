import 'reflect-metadata';
import {inject, injectable, singleton} from 'tsyringe';
import {PrismaClient} from '@prisma/client';
import * as Private from '~/domain/models/private';
import {OrderSwapApplication} from '~/application/orderSwap.application';
import {TradingWalletApplication} from '~/application/tradingWallet.application';
import {ConfigService, LoggerService} from '~/domain/services';
import {prismaClient} from './dependencyContext';

import * as RoundPrice from './roundPrice';
import {inRange, isInteger} from 'lodash';
import {isBinInterval, isWindowInterval} from '~/domain/models/private';

@singleton()
@injectable()
export class CliServerApplication {
  constructor(
    @inject('ConfigService')
    private readonly configService: ConfigService,

    @inject('LoggerService')
    private readonly loggerService: LoggerService,

    @inject('PrismaClient')
    readonly prisma: PrismaClient,

    @inject('OrderSwapApplication')
    private readonly orderSwapApplication: OrderSwapApplication,

    @inject('TradingWalletApplication')
    private readonly tradingWalletApplication: TradingWalletApplication
  ) {}

  async orderSwap({
    rebuildAll,
    rebuildById,
  }: {
    rebuildAll?: boolean;
    rebuildById?: string;
  }) {
    if (rebuildAll) {
      return this.orderSwapApplication.rebuildAllOrderSwaps(prismaClient);
    } else if (rebuildById) {
      await prismaClient.$transaction(
        async prisma =>
          this.orderSwapApplication.createOrUpdateOrderSwapByEventStreamIdOrThrow(
            prisma,
            rebuildById
          ),
        this.configService.getPrismaTransactionOptions()
      );
    } else return null;
  }

  setRoundPrice(options: RoundPrice.SetRoundPriceRequest) {
    return RoundPrice.setRoundPrice(options);
  }

  private async batchUpdateAllTradingWallets(
    batchSize: number,
    binInterval: Private.BinInterval,
    windowInterval: Private.WindowInterval,
    tradingWalletsCursor?: string
  ): Promise<void> {
    this.loggerService.info(
      `Batch updating trading wallet profitability metrics at cursor ${tradingWalletsCursor}...`
    );

    const tradingWalletsNextCursor =
      await this.tradingWalletApplication.batchUpdateProfitabilityMetrics(
        this.prisma,
        batchSize,
        binInterval,
        windowInterval,
        tradingWalletsCursor
      );

    if (tradingWalletsNextCursor) {
      this.batchUpdateAllTradingWallets(
        batchSize,
        binInterval,
        windowInterval,
        tradingWalletsNextCursor
      );
    } else {
      return;
    }
  }

  async batchUpdateAllTradingWalletProfitabilityMetrics(options: {
    windowInterval: string;
    binInterval: string;
    batchSize: string;
  }) {
    this.loggerService.info(
      `Setting trading wallet profitability metrics with ` +
        `windowInterval: ${options.windowInterval}, ` +
        `binInterval: ${options.binInterval}, ` +
        `batchSize: ${options.batchSize}...`
    );

    const windowInterval = isWindowInterval(options.windowInterval)
      ? options.windowInterval
      : null;

    const binInterval = isBinInterval(options.binInterval)
      ? options.binInterval
      : null;

    const batchSize = Number(options.batchSize);

    if (
      !(isInteger(batchSize) && inRange(batchSize, 1, 100)) ||
      windowInterval === null ||
      binInterval === null
    ) {
      throw new Error(
        `Invalid arguments: window interval is ${windowInterval} and bin interval is ${binInterval} and batch size is ${batchSize}`
      );
    }

    await this.batchUpdateAllTradingWallets(
      batchSize,
      binInterval,
      windowInterval
    );

    this.loggerService.info(
      'Done setting trading wallet profitability metrics'
    );
  }
}
