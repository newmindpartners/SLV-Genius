import { KeyboardArrowDown, KeyboardArrowUp } from '@mui/icons-material';
import { Grid, IconButton, styled } from '@mui/material';
import { useCallback, useState } from 'react';
import { IChartItemExtraData } from '~/pages/Leaderboard/types/IChartItem';
import { Asset } from '~/redux/api';

import { FeeSection } from './FeesSection';
import { getFeeSectionsSummary, Section } from './utils';

type Props = {
  cursorChartData: IChartItemExtraData;
  assetPair: { assetOne: Asset; assetTwo: Asset };
};

const TradingWalletFees = ({ cursorChartData, assetPair }: Props) => {
  const { assetOne, assetTwo } = assetPair;
  const [isExpanded, setIsExpanded] = useState(false);
  const toggleIsExpanded = useCallback(() => setIsExpanded((prev) => !prev), []);

  const feeSummary = getFeeSectionsSummary(cursorChartData);

  return (
    <Wrapper display="flex" flexDirection="row">
      <ToggleFeesButton aria-label="expand row" size="small" onClick={toggleIsExpanded}>
        {isExpanded ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
      </ToggleFeesButton>
      <FeesSectionWrapper
        display="flex"
        justifyContent={{
          xs: 'flex-start',
          md: 'space-between',
        }}
        flexWrap={{
          xs: 'wrap',
          md: 'nowrap',
        }}
      >
        {assetOne && (
          <FeeSection
            title={`Net ${assetOne.shortName}`}
            tooltipText={`The difference between the amount of ${assetOne.shortName} bought and sold.`}
            totalFee={feeSummary[Section.TradedAssetOne].totalFee}
            fees={feeSummary[Section.TradedAssetOne].breakdown}
            isExpanded={isExpanded}
          />
        )}
        {assetTwo && (
          <FeeSection
            title={`Net ${assetTwo.shortName}`}
            tooltipText={`The difference between the amount of ${assetTwo.shortName} bought and sold.`}
            totalFee={feeSummary[Section.TradedAssetTwo].totalFee}
            fees={feeSummary[Section.TradedAssetTwo].breakdown}
            isExpanded={isExpanded}
          />
        )}
        {assetOne && (
          <FeeSection
            title={`Fees ${assetOne.shortName}`}
            tooltipText={`The total of all maker fees calculated as 0.3% of the amount sold.

                          The maker fees are only applied to orders which are either open, partially or fully filled which excludes all cancelled orders which were never filled.`}
            totalFee={feeSummary[Section.FeesAssetOne].totalFee}
            fees={feeSummary[Section.FeesAssetOne].breakdown}
            isExpanded={isExpanded}
          />
        )}
        {assetTwo && (
          <FeeSection
            title={`Fees ${assetTwo.shortName}`}
            tooltipText={`The total of: the transaction fees for opening and cancelling orders, a flat maker fee of 1 ADA per order created and a maker fee calculated as 0.3% of the amount sold.

                          The maker fees are only applied to orders which are either open, partially or fully filled which excludes all cancelled orders which were never filled.

                          Flat fees are always represented in ADA, where as percentage fees are always represented in the from asset.`}
            totalFee={feeSummary[Section.FeesAssetTwo].totalFee}
            fees={feeSummary[Section.FeesAssetTwo].breakdown}
            isExpanded={isExpanded}
          />
        )}
      </FeesSectionWrapper>
    </Wrapper>
  );
};

const Wrapper = styled(Grid)`
  background-color: #28304e;
  padding: 0.1rem 0.25rem;
  border-radius: 0.9rem;
`;

const FeesSectionWrapper = styled(Grid)`
  gap: 1rem;
  margin: 0.5rem;
`;

const ToggleFeesButton = styled(IconButton)`
  width: 2rem;
  height: 2rem;
  align-self: start;
  margin-top: 0.9rem;
`;

export default TradingWalletFees;
