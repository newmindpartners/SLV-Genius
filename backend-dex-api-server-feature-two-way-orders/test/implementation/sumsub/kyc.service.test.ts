import 'reflect-metadata';

import {User, UserValidationResult} from '~/domain/models/private';

import {ConfigServiceNode} from '~/implementation/node/config.service';
import {KycServiceSumsub} from '~/implementation/kyc/sumsub/kyc.service';

import {SumsubServiceMock} from './kyc.service.mock';

import {walletAddressBech32ToStakeKeyHash} from '~/domain/utils/wallet.util';

test('DONT create access token if kyc is NOT required', async () => {
  const user = await validateUser({userId: '1'});

  expect(user.kycAccessToken).toBeNull();
});

test('create access token if kyc is required', async () => {
  const kycAccessToken = 'ACCESS_TOKEN';

  const user = await validateUser({userId: '2', kycAccessToken});

  expect(user.kycAccessToken).toBe(kycAccessToken);
});

const validateUser = async (params: {
  userId: string;
  kycAccessToken?: string;
}): Promise<UserValidationResult> => {
  const {userId, kycAccessToken} = params;

  const kycService = new KycServiceSumsub(
    new ConfigServiceNode(),
    new SumsubServiceMock({createAccessToken: (): string => kycAccessToken!})
  );

  const user: User = {
    userId,
    userType: 'INDIVIDUAL',
    walletStakeKeyHash: walletAddressBech32ToStakeKeyHash(
      'addr_test1qr06lwepxjzq420erenkgdyd0kd4uzey8vm7l0fwkfxudade34ql5qevm2tyfnwluwdqa58tjp0fdf2xmhvws4r3nsnsj0p0y3'
    ) as string,
    acceptedTermsDate: new Date(),
    acceptedTermsVersion: '1.0.0',
    created: new Date(),
    updated: new Date(),
    userKyc: null,
  };

  return kycService.validateUser(user);
};
