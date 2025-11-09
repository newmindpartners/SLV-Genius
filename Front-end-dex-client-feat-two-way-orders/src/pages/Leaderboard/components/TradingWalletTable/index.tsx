import { Avatar, styled, Typography } from '@mui/material';
import { BaseTable } from '~/components/BaseTable';
import { BaseTableBody } from '~/components/BaseTable/BaseTableBody';
import { BaseTableHead } from '~/components/BaseTable/BaseTableHead';
import { BaseTableRow } from '~/components/BaseTable/BaseTableRow';
import { BaseTableCell } from '~/components/BaseTable/TableCell';
import Button from '~/components/Button/Button';
import TableSkeleton from '~/components/EnhancedTable/TableSkeleton';
import { proportionalToPercent } from '~/pages/TradingWallet/helpers/formatting';
import { TradingWallet } from '~/redux/api';
import { formatDuration } from '~/utils/dateUtils';
import { formatNumberWithPrecision } from '~/utils/math';

import { formatPercentage } from '../../helpers/formatPercentage';
import { getTradingWalletProfile } from '../../helpers/getTradingWalletProfile';
import { AvatarTag } from '../AvatarTag';

export interface TradingWalletTableProps {
  tradingWallets: TradingWallet[];
  isLoading?: boolean;
  onViewTradingWallet?: (id: string) => void;
}

export const TradingWalletTable = ({
  tradingWallets,
  isLoading,
  onViewTradingWallet,
}: TradingWalletTableProps) => {
  if (isLoading) return <TableSkeleton />;

  return (
    <BaseTable>
      <BaseTableHead>
        <BaseTableRow>
          <BaseTableCell>Name</BaseTableCell>
          <BaseTableCell>From</BaseTableCell>
          <BaseTableCell>To</BaseTableCell>
          <BaseTableCell>Earned (ADA)</BaseTableCell>
          <BaseTableCell>ROI</BaseTableCell>
          <BaseTableCell>Runtime</BaseTableCell>
          <BaseTableCell />
        </BaseTableRow>
      </BaseTableHead>

      <BaseTableBody>
        {tradingWallets.map((tradingWallet) => {
          const tradingWalletProfile = getTradingWalletProfile({
            tradingWalletStakeKeyHash: tradingWallet.tradingWalletStakeKeyHash,
            assetOneId: tradingWallet.assetOne.assetId,
            assetTwoId: tradingWallet.assetTwo.assetId,
          });

          return (
            <BaseTableRow key={tradingWallet.tradingWalletId}>
              <BaseTableCell>
                <AvatarTag
                  src={tradingWalletProfile.avatar}
                  label={tradingWalletProfile.name}
                />
              </BaseTableCell>

              <BaseTableCell sx={{ maxWidth: '10rem' }}>
                <AvatarTag
                  src={tradingWallet.assetOne.iconUrl}
                  label={tradingWallet.assetOne.shortName}
                />
              </BaseTableCell>

              <BaseTableCell sx={{ maxWidth: '10rem' }}>
                <AvatarTag
                  src={tradingWallet.assetTwo.iconUrl}
                  label={tradingWallet.assetTwo.shortName}
                />
              </BaseTableCell>

              <BaseTableCell>
                {tradingWallet.earnedAdaAssetAmount
                  ? formatNumberWithPrecision(
                      Number(tradingWallet.earnedAdaAssetAmount),
                      2,
                    )
                  : '-'}
              </BaseTableCell>

              <BaseTableCell>
                {tradingWallet.roiPercent
                  ? formatPercentage(
                      proportionalToPercent(tradingWallet.roiPercent),
                      true,
                    )
                  : '-'}
              </BaseTableCell>

              <BaseTableCell>
                {tradingWallet.startDate
                  ? formatDuration(new Date(tradingWallet.startDate), new Date())
                  : '-'}
              </BaseTableCell>

              <BaseTableCell align="right">
                <Button
                  variant="text"
                  color="common"
                  size="small"
                  sx={{ minWidth: '6rem' }}
                  onClick={() => onViewTradingWallet?.(tradingWallet.tradingWalletId)}
                >
                  View Bot
                </Button>
              </BaseTableCell>
            </BaseTableRow>
          );
        })}
      </BaseTableBody>
    </BaseTable>
  );
};

TradingWalletTable.BotTagAvatar = styled(Avatar)`
  width: 1.5rem;
  height: 1.5rem;
`;

TradingWalletTable.BotTagTypography = styled(Typography)`
  line-clamp: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

TradingWalletTable.BotTagWrapper = styled('div')`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing(1)};
`;
