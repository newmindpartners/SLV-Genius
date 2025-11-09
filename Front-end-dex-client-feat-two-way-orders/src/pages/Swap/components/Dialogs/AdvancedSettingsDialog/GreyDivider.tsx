import { styled } from '@mui/material';
import Grid from '@mui/material/Grid/Grid';

const GreyDivider = () => <Divider width="100%" height="1px" />;

const Divider = styled(Grid)(({ theme }) => ({
  backgroundColor: theme.palette.highlightedFrames.main,
}));

export default GreyDivider;
