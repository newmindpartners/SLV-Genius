import { Grid, SelectChangeEvent, styled, Typography } from '@mui/material';
import MultipleDropdown from '~/components/Dropdown/MultipleDropdown';
import { InfoIcon } from '~/components/Icons';
import { Coins } from '~/components/Icons/Icons';
import Tooltip from '~/components/Tooltip';
import { StakingNft, StakingProject } from '~/redux/api';
import { byteArrayFromHex } from '~/utils/buffer';
import { indivisibleToUnit, round, trimTrailingZeros } from '~/utils/mathUtils';
import { isNftValidToStakeWithCombination } from '~/utils/nftUtils';

type StakeNftsFieldProps = {
  nfts: StakingNft[];
  selectedProject: StakingProject;
  selectedNfts: string[];
  handleSelectedNftsChange: (e: SelectChangeEvent<unknown>) => void;
};

const StakeNftsField = ({
  nfts,
  selectedNfts,
  selectedProject,
  handleSelectedNftsChange,
}: StakeNftsFieldProps) => {
  const selectedNftsItems = selectedNfts.reduce(
    (acc: StakingNft[], currentNft: string) => {
      const nft = nfts.find(
        (nft) => nft.type + nft.subType + nft.assetName === currentNft,
      );
      return nft ? [...acc, nft] : acc;
    },
    [],
  );

  const options = nfts.map((nft) => ({
    icon: nft.imageUrl ? (
      <OptionIcon
        src={nft.imageUrl}
        alt={nft.name + ' icon'}
        sx={{ borderRadius: '50%' }}
      />
    ) : null,
    value: nft.type + nft.subType + nft.assetName,
    title: `${nft.name} - ${byteArrayFromHex(nft.assetName)}`,
    preview: `${nft.name} - ${byteArrayFromHex(nft.assetName)}`,
    disabled: !isNftValidToStakeWithCombination(nft, selectedNftsItems),
    endAdornment: nft.apyBoost ? (
      <NFTApyStats {...nft} />
    ) : (
      <NFTVestingStats {...nft} {...selectedProject} />
    ),
  }));

  return (
    <LabeledField item container direction="column" rowGap={1}>
      <Grid container columnGap="10px">
        <Typography variant="statusCard" color="soldOutColorStatus.main">
          NFT:
        </Typography>
        <Tooltip title="Add NFTs to your Staking Vault to boost rewards generated">
          <div>
            <InfoIcon />
          </div>
        </Tooltip>
      </Grid>
      <MultipleDropdown
        label="Select..."
        emptyResultsMessage="No NFTs found"
        options={options}
        value={selectedNfts}
        handleChange={handleSelectedNftsChange}
      />
    </LabeledField>
  );
};

const NFTApyStats = ({ apyBoost }: StakingNft) => (
  <StatsWrapper>
    <div>
      <Typography variant="statusCard" color="soldOutColorStatus.main">
        APY Boost
      </Typography>
    </div>
    <Grid
      item
      container
      flexWrap="nowrap"
      justifyContent="flex-end"
      alignItems="center"
      columnGap="5px"
    >
      <Grid item>
        <InfoValue textAlign="end">+{apyBoost} APY</InfoValue>
      </Grid>
      <Grid item>
        <Coins />
      </Grid>
    </Grid>
  </StatsWrapper>
);

const NFTVestingStats = ({ vestingBoost, stakingAsset }: StakingNft & StakingProject) => {
  const nftVesting = indivisibleToUnit(
    vestingBoost || '0',
    stakingAsset.decimalPrecision,
  );
  const roundedNftVesting = trimTrailingZeros(round(nftVesting, 1));

  return (
    <StatsWrapper>
      <div>
        <Typography variant="statusCard" color="soldOutColorStatus.main">
          Vesting
        </Typography>
      </div>
      <div>
        {roundedNftVesting} {stakingAsset.shortName}
      </div>
    </StatsWrapper>
  );
};

const StatsWrapper = styled(Grid)({
  display: 'flex',
  alignItems: 'center',
  columnGap: '7px',

  svg: {
    width: '13px',
    display: 'block',
  },
});

const InfoValue = styled(Typography)({
  color: '#6AFFA6',
});

const LabeledField = styled(Grid)({
  '& > .MuiFormControl-root': {
    width: '100%',
    minHeight: '70px',
  },
});

const OptionIcon = styled('img')({
  width: '20px',
  display: 'block',
});

export default StakeNftsField;
