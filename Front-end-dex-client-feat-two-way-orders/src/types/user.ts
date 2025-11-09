import { UserConnect, UserConnectResponse } from '~/redux/api';

import { FailurePayload } from './error';
import { CallbackHandlers } from './shared';
import { WalletType } from './wallet';

export type UserConnectSuccessPayload = {
  user: UserConnectResponse;
  onSuccess: CallbackHandlers['onSuccess'];
};

export type UserConnectFailurePayload = FailurePayload & {
  onFailure?: CallbackHandlers['onFailure'];
};

export type UserConnectWalletPayload = UserConnect & {
  onSuccess?: CallbackHandlers['onSuccess'];
  onFailure?: CallbackHandlers['onFailure'];
  walletType: WalletType;
};
