import {
  Grid,
  InputAdornment,
  SelectChangeEvent,
  styled,
  Typography,
} from '@mui/material';
import { ChangeEvent } from 'react';
import Dropdown from '~/components/Dropdown/Dropdown';
import TextField from '~/components/TextField/TextField';
import { StakingProject } from '~/redux/api';

type StakeAmountFieldProps = {
  projects: StakingProject[];
  selectedProject: StakingProject | null;
  stakeAmount: string | null;
  availableAmount: string | null;

  handleStakeAmountChange: (e: ChangeEvent<HTMLInputElement>) => void;
  handleSelectedProjectChange: (e: SelectChangeEvent<unknown>) => void;
};

const StakeAmountField = ({
  stakeAmount,
  projects,
  selectedProject,
  availableAmount,

  handleStakeAmountChange,
  handleSelectedProjectChange,
}: StakeAmountFieldProps) => (
  <LabeledField item container rowGap={1}>
    <Grid container justifyContent="space-between">
      <Typography variant="statusCard" color="soldOutColorStatus.main">
        Amount to stake:
      </Typography>
      {availableAmount && (
        <Typography variant="statusCard" color="soldOutColorStatus.main">
          Available: {availableAmount} {selectedProject?.stakingAsset.shortName}
        </Typography>
      )}
    </Grid>
    <StakeAmountTextfield
      fullWidth
      // eslint-disable-next-line jsx-a11y/no-autofocus
      autoFocus
      autoComplete="off"
      color="primary"
      placeholder="0"
      value={stakeAmount}
      onChange={handleStakeAmountChange}
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            <Dropdown
              icon={false}
              label="..."
              options={projects.map((project) => ({
                icon: (
                  <OptionIcon
                    src={project.stakingAsset.iconUrl}
                    alt={project.stakingAsset.shortName + ' icon'}
                  />
                ),
                title: project.stakingAsset.shortName,
              }))}
              value={selectedProject?.stakingAsset?.shortName || ''}
              handleChange={handleSelectedProjectChange}
              className="projects-selection-dropdown"
            />
          </InputAdornment>
        ),
      }}
    />
  </LabeledField>
);

const LabeledField = styled(Grid)({
  '& > .MuiFormControl-root': {
    minHeight: '80px',

    '@media (max-width: 1500px)': {
      minHeight: '70px',
    },
  },
  'input + div + fieldset': {
    borderColor: 'transparent !important',
  },
  'input:focus + div + fieldset, input:hover + div + fieldset': {
    borderColor: 'rgba(255, 255, 255, 0.7) !important',
    borderWidth: '1px !important',
  },
});

const StakeAmountTextfield = styled(TextField)({
  '& .MuiInputBase-root': {
    paddingRight: '1px',
    background: '#151D2E',
  },
});

const OptionIcon = styled('img')({
  width: '20px',
  display: 'block',
});

export default StakeAmountField;
