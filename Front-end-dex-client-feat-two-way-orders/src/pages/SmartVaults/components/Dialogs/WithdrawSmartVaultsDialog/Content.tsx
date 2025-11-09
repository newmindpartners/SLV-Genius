import { Grid, Tooltip, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { FC } from 'react';
import Avatar from '~/components/Avatar/Avatar';
import { InfoIcon } from '~/components/Icons';
import { SmartVault, SmartVaultAssetDetailed } from '~/redux/api';
import { formatDate } from '~/utils/dateUtils';
import { indivisibleToUnit } from '~/utils/mathUtils';

interface Props {
  smartVault: SmartVault;
  estimationData: SmartVaultAssetDetailed[];
}

const Content: FC<Props> = ({ smartVault, estimationData }) => {
  return (
    <Grid container item gap={2} direction="column">
      <Grid container item gap={1}>
        <Typography color="#C1CEF1" fontSize="15px" fontWeight="600">
          Available withdraw amounts:
        </Typography>

        <List container>
          {estimationData.map((asset) => (
            <Item key={asset.assetId} container item>
              {/** TODO: How do we handle missing asset? */}
              <Logo variant="circle" src={asset.asset?.iconUrl || ''} />
              <Asset>
                {indivisibleToUnit(asset.assetAmount, asset.asset?.decimalPrecision || 6)}{' '}
                {asset.asset?.shortName}
              </Asset>
            </Item>
          ))}
        </List>
      </Grid>

      <WithdrawDataContentRow title="ROI %" tooltipText="" data={'-'} />
      <WithdrawDataContentRow
        title="Strategy"
        tooltipText=""
        data={smartVault.smartVaultStrategy?.name || '-'}
      />
      <WithdrawDataContentRow
        title="Creation Date"
        tooltipText=""
        data={formatDate(new Date(smartVault.created))}
      />
    </Grid>
  );
};

type WithdrawRowDataProps = {
  title: string;
  tooltipText: string;
  data: string;
};

const WithdrawDataContentRow: FC<WithdrawRowDataProps> = ({
  title,
  tooltipText,
  data,
}) => (
  <WithdrawDataRow>
    <Grid item display="flex" flexDirection="row" gap="5px" alignItems="center">
      <Typography color="#C1CEF1" fontSize="15px" fontWeight="600">
        {title}
      </Typography>

      <Tooltip title={tooltipText} placement="right">
        <Grid display="flex" alignItems="center">
          <InfoIcon />
        </Grid>
      </Tooltip>
    </Grid>

    <Typography fontSize="14px" fontWeight="500" lineHeight="18px" textAlign="right">
      {data}
    </Typography>
  </WithdrawDataRow>
);

const WithdrawDataRow = styled(Grid)({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
});

const Logo = styled(Avatar)(() => ({
  width: 30,
  height: 30,
}));

const List = styled(Grid)(() => ({
  gap: 4,
}));

const Item = styled(Grid)(() => ({
  gap: 8,
  alignItems: 'center',
}));

const Asset = styled(Typography)(() => ({
  color: '#fff',
  fontWeight: 700,
  fontSize: '15px',
  lineHeight: '22px',
}));

export default Content;
