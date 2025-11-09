import { Grid, styled, Typography } from '@mui/material';
import { ChangeEvent, FC } from 'react';
import Avatar from '~/components/Avatar/Avatar';
import { InfoIcon } from '~/components/Icons';
import TextField from '~/components/TextField/TextField';
import Tooltip from '~/components/Tooltip';
import { SmartVault } from '~/redux/api';

type ContentProps = {
  smartVault: SmartVault;
  assetsAmountsMap: Record<string, string>;
  setAssetsAmountsMap: React.Dispatch<React.SetStateAction<Record<string, string>>>;
};

const Content: FC<ContentProps> = ({
  smartVault,
  assetsAmountsMap,
  setAssetsAmountsMap,
}) => {
  const handleChangeAmount =
    (assetId: string) => (event: ChangeEvent<HTMLInputElement>) => {
      setAssetsAmountsMap((prev) => ({ ...prev, [assetId]: event.target.value }));
    };

  return (
    <Grid display="flex" gap="10px" direction="column">
      <Grid item display="flex" flexDirection="row" gap="10px" alignItems="center">
        <Typography fontSize="16px" fontWeight="700" lineHeight="28px">
          Enter amounts
        </Typography>

        <Tooltip title={''} placement="right">
          <Grid display="flex" alignItems="center">
            <InfoIcon />
          </Grid>
        </Tooltip>
      </Grid>

      {smartVault.depositedAssets.map((asset) => (
        <Grid display="flex" direction="column" gap="4px" key={asset.assetId}>
          <Typography
            color="#ABB4D1"
            component="label"
            fontSize="12px"
            fontWeight="400"
            lineHeight="16px"
          >
            Amount
          </Typography>
          <Grid display="flex" gap="8px">
            <TextField
              value={assetsAmountsMap[asset.assetId]}
              onChange={handleChangeAmount(asset.assetId)}
              placeholder="Enter amount"
              InputProps={{
                endAdornment: (
                  <Grid
                    container
                    gap={1}
                    flexWrap="nowrap"
                    width="fit-content"
                    alignItems="center"
                  >
                    <Logo
                      variant="circle"
                      // TODO: How do we handle missing asset?
                      src={asset.asset?.iconUrl || ''}
                      alt={asset.asset?.shortName}
                    />
                    <Typography>{asset.asset?.shortName}</Typography>
                  </Grid>
                ),
              }}
            />
          </Grid>
        </Grid>
      ))}

      <Grid
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        marginTop="10px"
      >
        <Grid item display="flex" flexDirection="row" gap="8px" alignItems="center">
          <Typography color="#C1CEF1" fontSize="15px" fontWeight="600">
            Selected Strategy
          </Typography>

          <Tooltip title={''} placement="right">
            <Grid display="flex" alignItems="center">
              <InfoIcon />
            </Grid>
          </Tooltip>
        </Grid>

        <Typography fontSize="14px" fontWeight="500" lineHeight="18px" textAlign="right">
          {smartVault.smartVaultStrategy?.name}
        </Typography>
      </Grid>
    </Grid>
  );
};

const Logo = styled(Avatar)(() => ({
  width: 26,
  height: 26,
}));

export default Content;
