import { Avatar, Grid, Typography } from '@mui/material';
import { SmartVaultAssetDetailed } from '~/redux/api';

const AssetItem = ({ ...props }: SmartVaultAssetDetailed) => {
  return (
    <Grid display="flex" gap="7px" alignItems="center">
      {/** TODO: How do we handle missing asset? */}
      <Avatar src={props.asset?.iconUrl || ''} sx={{ width: '30px', height: '30px' }} />
      <Typography>{props.assetAmount}</Typography>
      <Typography>{props.asset?.shortName}</Typography>
    </Grid>
  );
};

export default AssetItem;
