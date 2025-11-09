import { WalletBalanceRecord } from '~/utils/wallet';

import { OptionDto } from '../../types/OptionDto';

export interface IsOptionWrittenOptions {
  option: OptionDto;
  balance: WalletBalanceRecord;
}

export const isOptionWritten = ({ option, balance }: IsOptionWrittenOptions) => {
  return !!balance[option.asset];
};
