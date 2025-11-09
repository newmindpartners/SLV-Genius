import { knownTokens } from '../../mock/knownTokens';
import { OptionDto } from '../../types/OptionDto';
import { compareOptions } from './compareOptions';

export const fetchOptions = async (): Promise<OptionDto[]> => {
  const requestOptions = {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  };

  const response = await fetch(
    'https://dev.tx.geniusyield.co/DEX/option',
    requestOptions,
  );

  const infos: OptionDto[] = await response.json();

  const options: OptionDto[] = [];

  for (const info of infos) {
    const payment = knownTokens.find((t) => t.assetId === info.opiPaymentToken);
    const deposit = knownTokens.find((t) => t.assetId === info.opiDepositToken);

    if (deposit && payment) {
      options.push({
        ref: info.opiRef,
        opiSellerKey: info.opiSellerKey,
        asset: info.opiOptionToken,
        opiDepositAmt: info.opiDepositAmt,
        opiPaymentAmt: info.opiPaymentAmt,

        opiStart: info.opiStart,
        opiEnd: info.opiEnd,
        opiPrice: info.opiPrice,

        opiRef: info.opiRef,
        opiOptionToken: info.opiOptionToken,
        opiDepositToken: info.opiDepositToken,
        opiPaymentToken: info.opiPaymentToken,
      });
    }
  }

  return options.sort(compareOptions);
};
