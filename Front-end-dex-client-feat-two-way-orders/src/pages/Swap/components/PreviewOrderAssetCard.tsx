import { Avatar, Grid, styled, Typography } from '@mui/material';
import { FC } from 'react';
import { Asset } from '~/redux/api';

type AssetProps = {
  label: string;
  asset: Asset;
  amount: string;
  secondaryAmount: string;
};

const PreviewOrderAssetCard: FC<AssetProps> = ({
  label,
  asset,
  amount,
  secondaryAmount,
}) => {
  return (
    <Grid
      container
      item
      flexDirection="column"
      width="50%"
      alignContent="center"
      alignItems="center"
    >
      <Typography variant="tabsOnProjectsPage">{label}</Typography>
      <RoundIconWrapper src={asset.iconUrl} alt={asset.assetName} />
      <Typography
        fontSize="18px"
        align="center"
        fontFamily="secondaryFont"
        color="textColor"
        fontWeight="600"
      >
        {amount} {asset.shortName}
      </Typography>
      <Typography
        variant="roundWrapperCardDesc"
        align="center"
        fontFamily="secondaryFont"
        color="buttonsInactive.main"
      >
        {secondaryAmount}
      </Typography>
    </Grid>
  );
};

const RoundIconWrapper = styled(Avatar)({
  width: '50px',
  height: '50px',
  margin: '15px auto',

  '& img, & svg': {
    display: 'block',
    width: '100%',
    margin: 'auto',
    height: 'auto',
  },
});

export default PreviewOrderAssetCard;
