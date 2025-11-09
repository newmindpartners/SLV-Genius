import {SumsubClient} from '~/implementation/kyc/sumsub/sumsub.client';

import {KycData} from '~/domain/models/private';
import {KycStatus} from '~/domain/models/private';
import {KycProvider} from '~/domain/models/private';

const kycProvider = KycProvider.MOCK;

const KYC_EXAMPLE: Record<string, Record<string, KycData | KycStatus>> = {
  '1': {
    data: <KycData>{
      kycExternalId: '1',
      kycProvider,
      documents: [
        {
          expiryDate: '2099-01-01', // daysFromNow(1).toISOString(),
        },
      ],
      countryCode: 'CHE',
    },
    status: <KycStatus>{
      createDate: new Date().toISOString(),
      levelName: 'basic-kyc-level',
      reviewStatus: 'completed',
      reviewResult: 'GREEN',
      reviewDate: new Date().toISOString(),
    },
  },
  '2': {
    data: <KycData>{
      kycExternalId: '2',
      kycProvider,
      documents: [],
      countryCode: 'CHE',
    },
    status: <KycStatus>{
      createDate: new Date().toISOString(),
      levelName: 'basic-kyc-level',
      reviewStatus: 'completed',
      reviewResult: 'RED',
      reviewDate: new Date().toISOString(),
    },
  },
};

/* eslint-disable @typescript-eslint/no-unused-vars */
export class SumsubServiceMock implements SumsubClient {
  constructor(
    private readonly implementation: {
      createAccessToken: (
        userId: string,
        levelName?: string,
        ttlInSecs?: number
      ) => string;
    }
  ) {}

  createAccessToken(
    userId: string,
    levelName?: string,
    ttlInSecs?: number
  ): Promise<string> {
    return new Promise<string>(resolve =>
      resolve(
        this.implementation.createAccessToken(userId, levelName, ttlInSecs)
      )
    );
  }

  createApplicantIfNotExistsByUserId(
    userId: string,
    levelName?: string,
    sourceKey?: string
  ): Promise<void> {
    return Promise.resolve();
  }

  async getApplicantByUserId(userId: string): Promise<KycData | null> {
    return Promise.resolve(KYC_EXAMPLE[userId].data as KycData);
  }

  getApplicant(applicantId: string): Promise<KycData> {
    return Promise.resolve(KYC_EXAMPLE[applicantId].data as KycData);
  }

  getApplicantStatus(applicantId: string): Promise<KycStatus> {
    return Promise.resolve(KYC_EXAMPLE[applicantId].status as KycStatus);
  }
}
