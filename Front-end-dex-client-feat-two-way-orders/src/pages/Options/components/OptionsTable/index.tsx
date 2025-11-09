import { Stack, styled } from '@mui/material';
import { format } from 'date-fns';
import { BaseTable } from '~/components/BaseTable';
import { BaseTableBody } from '~/components/BaseTable/BaseTableBody';
import { BaseTableHead } from '~/components/BaseTable/BaseTableHead';
import { BaseTableRow } from '~/components/BaseTable/BaseTableRow';
import { BaseTableCell } from '~/components/BaseTable/TableCell';
import Button from '~/components/Button/Button';
import Chip, { ChipProps } from '~/components/Chip/Chip';
import ConnectWalletButtonDialog from '~/components/ConnectWalletButtonDialog';
import TableSkeleton from '~/components/EnhancedTable/TableSkeleton';
import { useWallet } from '~/hooks/wallet/wallet';
import { AvatarTag } from '~/pages/Leaderboard/components/AvatarTag';
import { indivisibleToUnit } from '~/utils/mathUtils';

import { knownTokens } from '../../mock/knownTokens';
import { OptionDto } from '../../types/OptionDto';
import { OptionStatus } from '../../types/OptionStatus';

export const optionStatusChipPropsMap: Record<string, ChipProps> = {
  [OptionStatus.Active]: { type: 'success', label: 'Active' },
  [OptionStatus.Expired]: { type: 'error', label: 'Expired' },
  [OptionStatus.NotStarted]: { type: 'default', label: 'Not started' },
};

export interface OptionsTableProps {
  showRetrieveButton: boolean;
  showExecuteButton: boolean;
  options: OptionDto[];
  isLoading: boolean;
  onExecute: (reference: string, amount: string) => void;
  onRetrieve: (reference: string, amount: string) => void;
}

export const OptionsTable = ({
  options,
  showExecuteButton,
  showRetrieveButton,
  isLoading,
  onExecute,
  onRetrieve,
}: OptionsTableProps) => {
  const { isWalletConnected } = useWallet();
  if (isLoading) return <OptionsTable.TableSkeleton />;

  return (
    <BaseTable>
      <BaseTableHead>
        <BaseTableRow>
          <BaseTableCell>From</BaseTableCell>
          <BaseTableCell>To</BaseTableCell>
          <BaseTableCell>Status</BaseTableCell>
          <BaseTableCell>End date</BaseTableCell>
          <BaseTableCell>Price</BaseTableCell>
          <BaseTableCell>Amount</BaseTableCell>
          <BaseTableCell />
        </BaseTableRow>
      </BaseTableHead>

      <BaseTableBody>
        {options.map((option) => {
          const deposit = knownTokens.find((t) => t.assetId === option.opiDepositToken);
          const payment = knownTokens.find((t) => t.assetId === option.opiPaymentToken);

          const start = new Date(option.opiStart);
          const end = new Date(option.opiEnd);
          const now = new Date();

          if (!payment || !deposit) return;

          const price =
            parseFloat(option.opiPrice) / 10 ** (payment.decimals - deposit.decimals);

          const status =
            now < start
              ? OptionStatus.NotStarted
              : now <= end
              ? OptionStatus.Active
              : OptionStatus.Expired;

          return (
            <BaseTableRow key={option.ref} sx={{ td: { py: 1.5 } }}>
              <BaseTableCell>
                <AvatarTag src={deposit?.logo} label={deposit?.ticker || ''} />
              </BaseTableCell>

              <BaseTableCell>
                <AvatarTag src={payment?.logo} label={payment?.ticker || ''} />
              </BaseTableCell>

              <BaseTableCell>
                <Chip {...optionStatusChipPropsMap[status]} variant="default" />
              </BaseTableCell>

              <BaseTableCell>{format(new Date(end), 'dd.MM.yyyy HH:mm')}</BaseTableCell>

              <BaseTableCell>{price}</BaseTableCell>
              <BaseTableCell>
                {indivisibleToUnit(String(option.opiDepositAmt), deposit.decimals)}{' '}
                {deposit.ticker}
              </BaseTableCell>

              <BaseTableCell>
                <Stack direction="row" justifyContent="flex-end" spacing={2}>
                  {showRetrieveButton &&
                    (!isWalletConnected ? (
                      <ConnectWalletButtonDialog size="xsmall" />
                    ) : (
                      <Button
                        size="small"
                        color="gradient"
                        disabled={status !== OptionStatus.Expired}
                        sx={{ fontWeight: 'bold' }}
                        onClick={() =>
                          onRetrieve(option.ref, String(option.opiDepositAmt))
                        }
                      >
                        Retrieve
                      </Button>
                    ))}

                  {showExecuteButton &&
                    (!isWalletConnected ? (
                      <ConnectWalletButtonDialog size="xsmall" />
                    ) : (
                      <Button
                        size="small"
                        color="gradient"
                        disabled={status !== OptionStatus.Active}
                        sx={{ fontWeight: 'bold' }}
                        onClick={() =>
                          onExecute(option.ref, String(option.opiDepositAmt))
                        }
                      >
                        Execute
                      </Button>
                    ))}
                </Stack>
              </BaseTableCell>
            </BaseTableRow>
          );
        })}
      </BaseTableBody>
    </BaseTable>
  );
};

OptionsTable.TableSkeleton = styled(TableSkeleton)`
  & > div > div {
    justify-content: space-between;
  }

  & span {
    margin-right: 0 !important;
  }
`;
