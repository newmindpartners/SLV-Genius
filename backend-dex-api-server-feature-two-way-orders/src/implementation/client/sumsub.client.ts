import {inject, injectable, singleton} from 'tsyringe';

import {KycData, KycProvider, KycStatus} from '~/domain/models/private';

import {SumsubClient} from '~/implementation/kyc/sumsub/sumsub.client';

import {
  DefaultApi,
  SumsubAccessToken,
  SumsubApplicant,
  SumsubApplicantStatus,
} from '~/implementation/client/sumsub/api';

import crypto from 'crypto';

import axios, {
  AxiosError,
  AxiosInstance,
  InternalAxiosRequestConfig,
} from 'axios';

import {ConfigService} from '~/domain/services';

import {ErrorCode} from '~/domain/errors/domain.error';

@singleton()
@injectable()
export class SumsubClientAxios implements SumsubClient {
  client: DefaultApi;

  kycProvider = KycProvider.SUMSUB;

  constructor(
    @inject('ConfigService') private readonly configService: ConfigService
  ) {
    this.client = new DefaultApi(
      undefined,
      configService.getSumsubBaseUrl(),
      this.createAxiosClientWithRequestSignatureInterceptor()
    );
  }

  async getApplicant(applicantId: string): Promise<KycData> {
    try {
      const response = await this.client.getApplicant([applicantId]);
      return this.toKycData(response.data);
    } catch (e) {
      throw new Error(ErrorCode.KYC__CONNECTION_ERROR);
    }
  }

  async getApplicantByUserId(userId: string): Promise<KycData | null> {
    try {
      const response = await this.client.getApplicantByUserId(userId);
      return this.toKycData(response.data);
    } catch (e) {
      return null;
    }
  }

  async getApplicantStatus(applicantId: string): Promise<KycStatus> {
    try {
      const response = await this.client.getApplicantStatus([applicantId]);
      return this.toKycStatus(response.data);
    } catch (e) {
      throw new Error(ErrorCode.KYC__CONNECTION_ERROR);
    }
  }

  async createApplicantIfNotExistsByUserId(
    userId: string,
    levelName: string
  ): Promise<void> {
    const applicantExists = await this.applicantExistsByUserId(userId);
    if (!applicantExists) {
      try {
        const sourceKey = this.configService.getSumsubSourceKey();

        await this.client.createApplicant(levelName, {
          sourceKey,
          externalUserId: userId,
        });
      } catch (e) {
        throw new Error(ErrorCode.KYC__CONNECTION_ERROR);
      }
    }
  }

  private async applicantExistsByUserId(userId: string): Promise<boolean> {
    try {
      const applicant = await this.getApplicantByUserId(userId);
      return !!applicant;
    } catch (e) {
      const typedError = e as AxiosError<SumsubApplicant>;
      const userExists = 409 === typedError.response?.status;
      if (userExists) return false;
      throw new Error(ErrorCode.KYC__CONNECTION_ERROR);
    }
  }

  async createAccessToken(
    userId: string,
    levelName: string,
    timeToLive: number | undefined
  ): Promise<string> {
    timeToLive = timeToLive || this.configService.getSumsubTimeToLive();

    try {
      const response = await this.client.createAccessToken(
        userId,
        levelName,
        timeToLive
      );

      return this.getAccessToken(response.data);
    } catch (e) {
      throw new Error(ErrorCode.KYC__CONNECTION_ERROR);
    }
  }

  private getAccessToken(response: SumsubAccessToken): string {
    return response.token;
  }

  private toKycData(response: SumsubApplicant): KycData {
    const {id: kycExternalId} = response;

    const {info = {idDocs: [], country: undefined, nationality: undefined}} =
      response;

    const countryCode = info?.country;

    const documents = (info?.idDocs || []).map(document => {
      const {validUntil: expiryDate, idDocType: documentType} = document;
      return {
        expiryDate,
        documentType,
      };
    });

    const {kycProvider} = this;

    return {
      kycExternalId,
      kycProvider,
      documents,
      countryCode,
    };
  }

  private toKycStatus(response: SumsubApplicantStatus): KycStatus {
    const {createDate, reviewDate, reviewStatus, levelName, reviewResult} =
      response;

    return {
      levelName,

      createDate,
      reviewDate,
      reviewStatus,

      reviewResult: reviewResult?.reviewAnswer,
    };
  }

  private createAxiosClientWithRequestSignatureInterceptor =
    (): AxiosInstance => {
      const baseUrl = this.configService.getSumsubBaseUrl();
      const appToken = this.configService.getSumsubAppToken();
      const secretKey = this.configService.getSumsubSecretKey();

      const instance = axios.create();
      instance.interceptors.request.use(
        this.setRequestSignature(baseUrl, secretKey, appToken),
        error => Promise.reject(error)
      );
      return instance;
    };

  private setRequestSignature(
    baseUrl: string,
    secretKey: string,
    appToken: string
  ) {
    return (
      request: InternalAxiosRequestConfig
    ): InternalAxiosRequestConfig => {
      const {method, url} = request;

      const path = url!.replace(baseUrl, '');
      const timestamp = Math.floor(Date.now() / 1000);
      const methodUppercase = method!.toUpperCase();

      const signaturePayload = timestamp + methodUppercase + path;

      const signatureHmac = crypto.createHmac('sha256', secretKey);

      signatureHmac.update(signaturePayload);

      if (request.data) signatureHmac.update(request.data);

      const signature = signatureHmac.digest('hex');

      request.headers['Accept'] = 'application/json';
      request.headers['X-App-Token'] = appToken;
      request.headers['X-App-Access-Ts'] = timestamp;
      request.headers['X-App-Access-Sig'] = signature;

      return request;
    };
  }
}
