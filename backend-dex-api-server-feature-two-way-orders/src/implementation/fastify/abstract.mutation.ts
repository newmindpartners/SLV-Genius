import {inject} from 'tsyringe';

import {ConfigService} from '~/domain/services';

export abstract class AbstractMutation {
  constructor(
    @inject('ConfigService') protected readonly configService: ConfigService
  ) {}
}
