import { Avatar } from '@mui/material';
import { Asset } from '~/redux/api';

const RewardAssetAvatar = ({ iconUrl, shortName }: Asset) => (
  <Avatar sx={{ width: '40px', height: '40px' }}>
    <img src={iconUrl} alt={`${shortName}-icon`} width="40px" height="40px" />
  </Avatar>
);

export default RewardAssetAvatar;
