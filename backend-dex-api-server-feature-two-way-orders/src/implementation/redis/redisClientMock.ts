// eslint-disable-next-line node/no-unpublished-import
import {Redis as IoRedis} from 'ioredis';
// eslint-disable-next-line node/no-unpublished-import
import IoRedisMock from 'ioredis-mock';

export class RedisMock {
  client: IoRedis;
  constructor() {
    this.client = new IoRedisMock();
  }
}
