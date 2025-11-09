import { Grid } from '@mui/material';
import { map } from 'lodash';

import BannerFeature from './BannerFeature';

const bannerData = [
  { title: 'Vault Staking', illustration: 'VaultStakingIllustration' },
  { title: 'Check NFT’s remaining utility', illustration: 'NFTCheckerIllustration' },
];

const BannerFeatures = () => (
  <Grid container flex="true" justifyContent="center" gap="35px" marginTop="80px">
    {map(bannerData, (data) => (
      <BannerFeature
        key={data.title}
        title={data.title}
        illustration={data.illustration}
      />
    ))}
  </Grid>
);

export default BannerFeatures;
