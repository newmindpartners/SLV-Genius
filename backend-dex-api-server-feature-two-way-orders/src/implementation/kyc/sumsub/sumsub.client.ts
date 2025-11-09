import * as Private from '~/domain/models/private';

export interface SumsubClient {
  getApplicant(applicantId: string): Promise<Private.KycData>;

  getApplicantStatus(applicantId: string): Promise<Private.KycStatus>;

  getApplicantByUserId(userId: string): Promise<Private.KycData | null>;

  createAccessToken(
    userId: string,
    levelName: string,
    ttlInSecs?: number
  ): Promise<string>;

  createApplicantIfNotExistsByUserId(
    userId: string,
    levelName: string
  ): Promise<void>;
}
