import { CircularProgress, Grid, styled } from '@mui/material';
import Typography from '@mui/material/Typography';
import { InfoIcon } from '~/components/Icons';
import Tooltip from '~/components/Tooltip';
import { trimTrailingZeros } from '~/utils/mathUtils';

type NftsInfoProps = {
  APY: string;
  isLoading: boolean;
};

const NftsInfo = ({ APY, isLoading }: NftsInfoProps) => {
  const apyParsed = parseFloat(APY)
    ? '+' + trimTrailingZeros(Number(APY).toFixed(4))
    : '-';

  return (
    <Wrapper>
      <Grid container alignItems="center">
        <Grid container item xs={5} columnGap="10px" alignItems="center">
          <Typography variant="statusCard" color="soldOutColorStatus.main">
            APY boost:
          </Typography>
          <Tooltip title="Additional APY boost enabled by staked NFTs">
            <div>
              <InfoIcon />
            </div>
          </Tooltip>
        </Grid>
        <Grid item xs={7} textAlign="right">
          {isLoading ? (
            <CircularProgress size={15} />
          ) : (
            <Typography>{apyParsed}% APY</Typography>
          )}
        </Grid>
      </Grid>
    </Wrapper>
  );
};

const Wrapper = styled('div')({
  marginBottom: '25px',

  svg: {
    display: 'block',
  },
});

export default NftsInfo;
