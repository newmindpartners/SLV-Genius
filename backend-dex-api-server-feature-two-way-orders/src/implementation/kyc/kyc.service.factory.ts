import {inject} from 'tsyringe';

import * as Private from '~/domain/models/private';

import {KycServiceMock} from '~/implementation/kyc/mock/kyc.service';
import {KycServiceSumsub} from '~/implementation/kyc/sumsub/kyc.service';

import {ConfigService, KycService} from '~/domain/services';

/* eslint-disable-next-line @typescript-eslint/no-explicit-any */
export type KycServiceClass = new (...args: any) => KycService;

export class KycServiceFactory {
  constructor(
    @inject('ConfigService') private readonly configService: ConfigService
  ) {}

  getKycService(): KycServiceClass {
    const kycProvider = this.configService.getKycProvider();
    if (kycProvider === Private.KycProvider.MOCK) return KycServiceMock;
    return KycServiceSumsub;
  }
}
