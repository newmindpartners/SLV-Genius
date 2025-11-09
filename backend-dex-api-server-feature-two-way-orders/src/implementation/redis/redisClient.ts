import {inject, singleton} from 'tsyringe';
import {ConfigService, LoggerService} from '~/domain/services';
import {Redis as IoRedis} from 'ioredis';

export const getRedisConfig = (config: ConfigService) => ({
  host: config.getRedisHost(),
  port: Number(config.getRedisPort()),
  password: config.getRedisPass(),
});

@singleton()
export class Redis {
  client: IoRedis;
  constructor(
    @inject('ConfigService')
    private readonly configService: ConfigService
  ) {
    this.client = new IoRedis({
      ...getRedisConfig(this.configService),
    });
  }
}
