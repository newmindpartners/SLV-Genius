import * as Seed from '~/seed/types';
import {ErrorCode} from '~/domain/errors/domain.error';
import {now} from '~/domain/utils/date.util';
import {walletAddressBech32ToStakeKeyHash} from '~/domain/utils/wallet.util';
import {PersistenceError} from '~/implementation/prisma/persistence.error';

function getWalletStakeKeyHash(bech32Address: string | undefined): string {
  const walletStakeKeyHash =
    bech32Address && walletAddressBech32ToStakeKeyHash(bech32Address);
  if (!walletStakeKeyHash)
    throw new PersistenceError(ErrorCode.WALLET_ADDRESS_MISSING_STAKE_PART);
  return walletStakeKeyHash;
}

export const user: Seed.User = {
  userId: '5b8966bd-3515-43f3-a7a5-c18294bdc885',
  userType: 'INDIVIDUAL',
  walletStakeKeyHash: getWalletStakeKeyHash(process.env.WALLET_PUBLIC_KEY),
  acceptedTermsDate: now(),
  acceptedTermsVersion: '1.0.0',
};

export const user2: Seed.User = {
  userId: '488c8b83-49f1-4792-849a-7d59075f090a',
  userType: 'INDIVIDUAL',
  walletStakeKeyHash: getWalletStakeKeyHash(process.env.WALLET_PUBLIC_KEY2),
  acceptedTermsDate: now(),
  acceptedTermsVersion: '1.0.0',
};
