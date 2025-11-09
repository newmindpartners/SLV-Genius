import {inject, injectable, singleton} from 'tsyringe';

import * as Private from '~/domain/models/private';
import axios, {AxiosInstance} from 'axios';
import {ConfigService, LoggerService} from '~/domain/services';
import {toOhlc} from './maestro.mapper';
import {isAda} from '~/domain/utils/asset.util';
import {flow} from 'lodash';
import {logRequest, requestStartTime, responseEndTime} from '../axios.utils';

export type Ohlc = {
  open: number;
  high: number;
  low: number;
  close: number;
  time: string;
};

// Bin options defined here -> https://docs.gomaestro.org/DefiMarketAPI/mkt-dex-ohlc
export type BinInterval =
  | '1m'
  | '5m'
  | '15m'
  | '30m'
  | '1h'
  | '4h'
  | '1d'
  | '1w'
  | '1mo';

export type MaestroOhlc = {
  coin_a_open: number;
  coin_a_high: number;
  coin_a_low: number;
  coin_a_close: number;
  coin_b_open: number;
  coin_b_high: number;
  coin_b_low: number;
  coin_b_close: number;
  timestamp: string;
};

export type MaestroCoinSelect = 'coin_a_' | 'coin_b_';

const getMaestroPair = ({
  baseAsset,
  quoteAsset,
}: {
  baseAsset: Private.Asset;
  quoteAsset: Private.Asset;
}): MaestroPair => {
  const isBaseAssetAda = isAda(baseAsset);
  const isQuoteAssetAda = isAda(quoteAsset);

  if (!isBaseAssetAda && !isQuoteAssetAda)
    throw new Error('Invalid market pair, neither ADA');
  else if (isBaseAssetAda && isQuoteAssetAda)
    throw new Error('Invalid market pair, both ADA');
  else if (isBaseAssetAda)
    return {
      pair: `ADA-${quoteAsset.shortName}`,
      coinSelect: 'coin_b_',
    };
  else if (isQuoteAssetAda)
    return {
      pair: `ADA-${baseAsset.shortName}`,
      coinSelect: 'coin_a_',
    };

  throw new Error('Invalid market pair');
};

type MaestroPair = {
  pair: `ADA-${string}`;
  coinSelect: MaestroCoinSelect;
};

type MaestroDexOptions = 'minswap' | 'genius-yield';

@injectable()
@singleton()
export class MaestroClientAxios {
  private readonly baseUrl: string;
  private readonly apiKey: string;
  private readonly timeout: number;

  private readonly client: AxiosInstance;

  constructor(
    @inject('ConfigService')
    private readonly configService: ConfigService,

    @inject('LoggerService')
    private readonly loggerService: LoggerService
  ) {
    this.baseUrl = this.configService.getMaestroApiUrl();
    this.apiKey = this.configService.getMaestroApiKey();
    this.timeout = this.configService.getTransactionServerTimeout();

    this.loggerService.info(`Maestro client baseUrl: ${this.baseUrl}`);

    const axiosClient = axios.create({
      baseURL: this.baseUrl,
      timeout: this.timeout,
      headers: {
        accept: 'application/json',
        'content-type': 'application/json',
        'api-key': this.apiKey,
      },
    });

    axiosClient.interceptors.request.use(
      flow(logRequest(loggerService), requestStartTime)
    );
    axiosClient.interceptors.response.use(
      responseEndTime(loggerService, 'Maestro client')
    );

    this.client = axiosClient;
  }

  async getMarketKline(
    assetPair: Private.AssetPair,
    startTime: Date,
    endTime: Date,
    resolution: BinInterval,
    dexTarget: MaestroDexOptions = 'genius-yield'
  ): Promise<Ohlc[]> {
    const {pair, coinSelect} = getMaestroPair(assetPair);

    const query = `/v1/markets/dexs/ohlc/${dexTarget}/${pair}`;

    const params = {
      resolution,
      from: startTime,
      to: endTime,
    };

    this.loggerService.info(
      `Maestro client query <${query}> params: ${JSON.stringify(params)}`
    );

    const {data: responseData} = await this.client.get(query, {
      params,
    });

    const data = toOhlc(coinSelect, responseData);

    this.loggerService.info(
      `Maestro client query: <${query}>, response count: <${data.length}>`
    );

    return data;
  }
}
