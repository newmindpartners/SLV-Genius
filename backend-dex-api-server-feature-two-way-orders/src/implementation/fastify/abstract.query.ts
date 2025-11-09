import {inject} from 'tsyringe';
import {ConfigService} from '~/domain/services';

export abstract class AbstractQuery {
  constructor(
    @inject('ConfigService') protected readonly configService: ConfigService
  ) {}
}
