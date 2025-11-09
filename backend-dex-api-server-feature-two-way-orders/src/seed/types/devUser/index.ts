import * as Seed from '..';

export type DevUserExports = {
  user: Seed.User;
  user2: Seed.User;
  userKyc: Seed.UserKyc;
  userKyc2: Seed.UserKyc;
  kycEvents: Seed.KycEvent[];
  kycEvents2: Seed.KycEvent[];
};

export const isDevUserExports = (
  fileImport: unknown
): fileImport is DevUserExports => {
  /**
   * Make sure this captures all required keys in `DevUserExports`
   * In an ideal world we would make TypeScript enforce this for us :)
   */
  if (typeof fileImport === 'object' && fileImport !== null) {
    const requiredKeys = [
      'user',
      'user2',
      'userKyc',
      'userKyc2',
      'kycEvents',
      'kycEvents2',
    ] as const;
    return requiredKeys.reduce((acc, x) => acc && x in fileImport, true);
  }
  return false;
};
