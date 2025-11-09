import {inject, singleton, injectable} from 'tsyringe';
import {LoggerService} from '~/domain/services';
import {Redis} from '../redisClient';
import * as Private from '~/domain/models/private';
import {Dictionary, groupBy, isEmpty, map, toString, zipObject} from 'lodash';
import {orderSwapOrderTypes} from '~/domain/models/private';
import {ApplicationError} from '~/application/application.error';
import {ErrorCode} from '~/domain/errors';

export type ExcludedOrderSwapCacheEntries = {
  utxoReferenceTransactionHash: string | null;
  utxoReferenceIndex: string | null;
  prefix: string;
  assetIds: string;
  orderSwapId: string;
  toAssetId: string;
  fromAssetId: string;
};

const KEY_PREFIX = 'orderSwapUtxoRefExclusion';
const KEY_SEPARATOR = ':';
const KEY_SUB_SEPARATOR = '.';
const UTXO_REF_SEPARATOR = '#';

const isValidProducingOrder = (orderSwap: Private.OrderSwap) =>
  typeof orderSwap.utxoReferenceIndex === 'number' &&
  orderSwap.utxoReferenceTransactionHash &&
  orderSwap.orderType === orderSwapOrderTypes.LIMIT
    ? 'validOrders'
    : 'invalidOrders';

const deconstructKey = (key: string) => {
  const [prefix, assetIds, orderSwapId] = key.split(KEY_SEPARATOR);
  const [toAssetId, fromAssetId] = assetIds.split(KEY_SUB_SEPARATOR);
  return {
    prefix,
    assetIds,
    orderSwapId,
    toAssetId,
    fromAssetId,
  };
};

const deconstructValue = (value: string | null) => {
  const [utxoReferenceTransactionHash, utxoReferenceIndex] = value
    ? value.split(UTXO_REF_SEPARATOR)
    : [null, null];
  return {utxoReferenceTransactionHash, utxoReferenceIndex};
};

const constructKey = ({
  orderSwapId,
  toAssetId,
  fromAssetId,
}: Private.OrderSwap) =>
  `${KEY_PREFIX}${KEY_SEPARATOR}${toAssetId}${KEY_SUB_SEPARATOR}${fromAssetId}${KEY_SEPARATOR}${orderSwapId}`;

const constructValue = ({
  utxoReferenceTransactionHash,
  utxoReferenceIndex,
}: Private.OrderSwap) =>
  `${utxoReferenceTransactionHash}${UTXO_REF_SEPARATOR}${utxoReferenceIndex}`;

// Redis keyspace https://redis.io/docs/manual/keyspace/
const transformOrderToKeyValue =
  (ttlSeconds: number) => (orderSwap: Private.OrderSwap) => ({
    key: constructKey(orderSwap),
    value: constructValue(orderSwap),
    ttlSeconds,
  });

const redisSetKeyValue =
  (redis: Redis) =>
  async ({
    key,
    value,
    ttlSeconds,
  }: {
    key: string;
    value: string;
    ttlSeconds: number;
  }) =>
    redis.client.set(key, value, 'EX', ttlSeconds);

/**
 * Responsible for caching valid producing / open order utxo refs.
 * Key includes assets and direction for improved specificity
 */
@singleton()
@injectable()
export class OrderSwapExclusionCache {
  constructor(
    @inject('LoggerService') private readonly loggerService: LoggerService,
    @inject('Redis') private readonly redis: Redis
  ) {}

  async excludeOrderSwaps(orderSwaps: Private.OrderSwap[], ttlSeconds: number) {
    // Isolate valid and invalid orders. Only producing orders have onchain references.
    const {invalidOrders, validOrders} = groupBy(
      orderSwaps,
      isValidProducingOrder
    );

    // error log invalid orders
    if (!isEmpty(invalidOrders))
      this.loggerService.error(
        new ApplicationError(
          ErrorCode.ORDER_SWAP__EXCLUSION_CACHE__INVALID_ORDERS_RECEIVED
        ),
        toString(map(invalidOrders, ({orderSwapId}) => orderSwapId))
      );

    // Transform orders to key value pairs
    const orderKeyValues = map(
      validOrders,
      transformOrderToKeyValue(ttlSeconds)
    );

    // set key values
    return await Promise.all(map(orderKeyValues, redisSetKeyValue(this.redis)));
  }

  private async getExcludedOrderSwapKeys(
    toAssetId: string,
    fromAssetId: string
  ): Promise<string[]> {
    return new Promise((resolve, reject) => {
      const stream = this.redis.client.scanStream({
        match: `${KEY_PREFIX}${KEY_SEPARATOR}${toAssetId}${KEY_SUB_SEPARATOR}${fromAssetId}${KEY_SEPARATOR}*`,
        count: 100,
      });
      const localKeys: string[] = [];
      stream.on('data', (resultKeys: string[]) => {
        map(resultKeys, key => {
          localKeys.push(key);
        });
      });
      stream.on('end', () => {
        resolve(localKeys);
      });
      stream.on('error', err => {
        reject(err);
      });
    });
  }

  private async getExcludedOrderSwapsUtxoRefPairs(
    exclusionListKeys: string[]
  ): Promise<Dictionary<string | null>> {
    if (!isEmpty(exclusionListKeys)) {
      const values = await this.redis.client.mget(exclusionListKeys);
      const keyValuePairs = zipObject(exclusionListKeys, values);
      return keyValuePairs;
    } else {
      return {};
    }
  }

  private parseKeyValuePairs(
    keyValuePairs: Dictionary<string | null>
  ): ExcludedOrderSwapCacheEntries[] {
    return map(keyValuePairs, (value, key) => ({
      ...deconstructKey(key),
      ...deconstructValue(value),
    }));
  }

  async getExcludedOrderSwapsUtxoRefs(
    toAssetId: string,
    fromAssetId: string
  ): Promise<ExcludedOrderSwapCacheEntries[]> {
    const exclusionListKeys = await this.getExcludedOrderSwapKeys(
      toAssetId,
      fromAssetId
    );

    const keyValuePairs = await this.getExcludedOrderSwapsUtxoRefPairs(
      exclusionListKeys
    );

    const exclusionList = this.parseKeyValuePairs(keyValuePairs);

    return exclusionList;
  }
}
