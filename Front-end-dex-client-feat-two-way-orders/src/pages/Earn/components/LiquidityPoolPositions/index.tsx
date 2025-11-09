import { HomePageIcon } from '~/components/Icons/Icons';
import ComingSoon from '~/pages/ComingSoon';

const liquidityPool = {
  title: 'Yield Farming',
  description: 'Coming soon...',
  image: <HomePageIcon />,
};

export const LiquidityPoolPositions = () => <ComingSoon {...liquidityPool} />;
