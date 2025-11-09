import {inject, injectable, singleton} from 'tsyringe';

import {UserTerms} from '~/domain/models/public';

import {ConfigService} from '~/domain/services';

export interface TermsService {
  /**
   * Validate a version and return the terms.
   *
   * @param acceptedTermsVersion accepted terms version if accepted
   *
   * @return Terms object
   */
  getLatestUserTerms(
    acceptedTermsVersion: string | null | undefined
  ): UserTerms;
}

@singleton()
@injectable()
export class TermsServiceImplementation implements TermsService {
  constructor(
    @inject('ConfigService') private readonly configService: ConfigService
  ) {}

  getLatestUserTerms(
    acceptedTermsVersion: string | null | undefined
  ): UserTerms {
    const latestTermsUrl = this.configService.getLatestTermsUrl();

    const {latestTermsVersion, isTermsAcceptanceRequired} =
      this.isLatestTerms(acceptedTermsVersion);

    return <UserTerms>{
      isTermsAcceptanceRequired,

      termsUrl: latestTermsUrl,
      termsVersion: latestTermsVersion,
    };
  }

  isLatestTerms(acceptedTermsVersion: string | null | undefined): {
    latestTermsVersion: string;
    isTermsAcceptanceRequired: boolean;
  } {
    const latestTermsVersion = this.configService.getLatestTermsVersion();

    const isTermsAcceptanceRequired =
      acceptedTermsVersion !== latestTermsVersion;

    return {latestTermsVersion, isTermsAcceptanceRequired};
  }
}
