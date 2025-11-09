import { FC, ReactElement, ReactNode } from 'react';
import NotificationBanner from '~/components/NotificationBanner/NotificationBanner';

type DexNotWorkingProps = {
  title: string;
  image?: ReactNode;
};

const BANNER_TITLE = 'page not available for the moment';
const BANNER_TEXT = 'We are working hard to make it available soon';

const DexNotWorking: FC<DexNotWorkingProps> = ({ title, image }): ReactElement => (
  <NotificationBanner
    title={`${title} ${BANNER_TITLE}`}
    text={BANNER_TEXT}
    image={image}
    hasHighlights={true}
  />
);

export default DexNotWorking;
