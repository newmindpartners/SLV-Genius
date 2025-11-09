import { Grid, styled, Typography } from '@mui/material';
import { FC } from 'react';
import { InfoIcon } from '~/components/Icons';
import TextField from '~/components/TextField/TextField';
import Tooltip from '~/components/Tooltip';
import { SmartVaultStrategy } from '~/redux/api/core';
import { clearStringNumericInput } from '~/utils/swapOrderUtils';
import { TradingAsset } from '~/utils/tradingPairsUtils';

import { SmartVaultsDataAsset } from '../../PageContent';
import AssetSelector from '../AssetSelector';
import StrategySelector from '../StrategySelector';
import { SmartVaultAssetData, SmartVaultsData } from './Card';

type CardContentProps = {
  assets: SmartVaultAssetData[];
  strategy: SmartVaultStrategy | null;
  strategies?: SmartVaultStrategy[];
  tradingAssets: TradingAsset[];
  smartVaultData: SmartVaultsData;
  setSmartVaultData: React.Dispatch<React.SetStateAction<SmartVaultsData>>;
  onChangeAssets: (assets: SmartVaultAssetData[]) => void;
};

export type TokenTabsType = 'Token' | 'Options';

const CardContent: FC<CardContentProps> = ({
  assets,
  strategy,
  strategies,
  tradingAssets,
  onChangeAssets,
  setSmartVaultData,
  smartVaultData,
}) => {
  const fieldCount = strategy ? strategy.numberOfAssetsSupported || 2 : 2;

  const getFilteredAssets = (index: number) => {
    return tradingAssets.filter((asset) => {
      const selectedAssetShortNames = assets
        .filter((a) => a.asset)
        .map((a) => a.asset!.shortName);

      return (
        !selectedAssetShortNames.includes(asset.shortName) ||
        assets[index]?.asset?.shortName === asset.shortName
      );
    });
  };

  const handleChangeStrategy = (option: SmartVaultStrategy | null) => {
    const filteredData = smartVaultData.assets.slice(0, option?.numberOfAssetsSupported);
    setSmartVaultData((prev) => ({
      ...prev,
      selectedStrategy: option,
      assets: filteredData,
    }));
  };

  const handlePriceChange = (index: number, price: string) => {
    const newAssets = [...assets];
    newAssets[index] = { ...newAssets[index], price };
    onChangeAssets(newAssets);
  };

  const handleAssetChange = (index: number, asset: SmartVaultsDataAsset | null) => {
    const newAssets = [...assets];

    if (asset === null) {
      newAssets[index] = { asset: null, price: '' };
    } else {
      newAssets[index] = { ...newAssets[index], asset };
    }

    onChangeAssets(newAssets);
  };

  return (
    <Wrapper container direction="column">
      <Grid display="flex" container direction="row" gap="8px">
        <Tooltip
          disableInteractive
          title={
            `Select two tokens that you'd like to trade and enter the amount.\n` +
            `“From” - tokens that you'd like to sell.\n` +
            `“To” - tokens that you'd like to buy.\n` +
            `Confirm the trade by clicking the “Place Order” button.`
          }
        >
          <Info>
            <Typography fontWeight={600} fontSize="14px" lineHeight="20px">
              Select Strategy
            </Typography>
            <InfoIcon />
          </Info>
        </Tooltip>
      </Grid>

      <Grid display="flex" direction="column" gap="16px">
        <SelectWrapper display="flex" gap="8px" pt="8px" pb="16px">
          <StrategySelector
            options={strategies}
            value={strategy}
            onChange={handleChangeStrategy}
            placeholder="Select"
          />
          <SelectLine />
        </SelectWrapper>
        {Array.from({ length: fieldCount }).map((_, index) => (
          <Grid display="flex" direction="column" gap="8px" key={index}>
            <Typography variant="body2" color="chip.default.color" component="label">
              Amount
            </Typography>
            <Grid display="flex" gap="8px">
              <TextField
                value={assets[index]?.price || ''}
                onChange={(e) =>
                  handlePriceChange(index, clearStringNumericInput(e.target.value))
                }
                placeholder="Enter amount"
              />
              <Grid width="155px">
                <AssetSelector
                  options={getFilteredAssets(index)}
                  value={assets[index]?.asset || null}
                  onChange={(option) => handleAssetChange(index, option)}
                  disabled={!index}
                />
              </Grid>
            </Grid>
          </Grid>
        ))}
      </Grid>

      <Line />
    </Wrapper>
  );
};

const Info = styled(Grid)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  columnGap: '8px',
  fontWeight: '500',
  fontSize: '12px',
  lineHeight: '16px',
  color: theme.palette.grey[100],

  [theme.breakpoints.down('sm')]: {
    fontSize: '12px',
    lineHeight: '16px',
  },
}));

const Wrapper = styled(Grid)(({ theme }) => ({
  padding: '20px 29px 20px',

  [theme.breakpoints.down('sm')]: {
    padding: '12px 20px 20px',
  },
}));

const Line = styled(Grid)({
  marginTop: '32px',
  borderTop: '1px solid #323F62',
});

const SelectWrapper = styled(Grid)({
  position: 'relative',

  '& > div': {
    width: '100%',
  },
});

const SelectLine = styled('span')({
  position: 'absolute',
  bottom: '1.5px',
  width: '100%',
  height: '1px',
  backgroundColor: '#2D3758',
  zIndex: '1',
});

export default CardContent;
