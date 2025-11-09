import { Grid } from '@mui/material';
import { map } from 'lodash';
import { useState } from 'react';
import { FormattedFee } from '~/utils/swapOrderFeeUtils';

import CardExpandable from '../CardExpandable';

type OrderFeesProps = {
  isLoadingFee: boolean;
  fee: FormattedFee[];
};

const OrderFees = ({ isLoadingFee, fee }: OrderFeesProps) => {
  const [isCardExpanded, setIsCardExpanded] = useState(false);

  const onExpandClickToggle = () => setIsCardExpanded(!isCardExpanded);

  return (
    <Grid display="flex" flexDirection="column" gap="12px">
      {map(fee, (elem) => (
        <CardExpandable
          key={elem.previewItem.label}
          isLoading={isLoadingFee}
          isExpanded={isCardExpanded}
          onExpandClick={onExpandClickToggle}
          {...elem}
        />
      ))}
    </Grid>
  );
};

export default OrderFees;
