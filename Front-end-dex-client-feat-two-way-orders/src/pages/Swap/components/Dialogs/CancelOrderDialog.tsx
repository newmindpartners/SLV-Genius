import { Avatar, CircularProgress, Grid, styled, Typography } from '@mui/material';
import { FC } from 'react';
import Button from '~/components/Button/Button';
import BlurryDialog from '~/components/Dialogs/Dialog/BlurryDialog';
import { InfoIcon } from '~/components/Icons';
import Tooltip from '~/components/Tooltip';
import useSwapCancelOrderSubmit from '~/hooks/swap/order/cancel/submit';
import { Asset, SwapOrder } from '~/redux/api';
import { indivisibleToUnit } from '~/utils/mathUtils';

export type CancelOrderDialogProps = {
  order: SwapOrder;
  onClose: () => void;
};

const CancelOrderDialog: FC<CancelOrderDialogProps> = ({ order, onClose }) => {
  const { handleCancelOrder, isLoadingCancellation } = useSwapCancelOrderSubmit({
    orderId: order.orderId,
    onSuccess: onClose,
  });

  return (
    <BlurryDialog
      title="Remove order?"
      onClose={onClose}
      sx={{
        '.MuiDialogContent-root': {
          paddingLeft: '0',
          paddingRight: '0',
        },
      }}
    >
      <Content
        order={order}
        subtitle={'Are you sure you want to remove this order?\nThis can not be undone.'}
      />
      <Actions
        onClose={onClose}
        onCancel={handleCancelOrder}
        isLoading={isLoadingCancellation}
      />
    </BlurryDialog>
  );
};

type ContentProps = {
  subtitle: string;
  order: SwapOrder;
};

const Content = ({ subtitle, order }: ContentProps) => {
  const toAsset = order.toAsset;
  const fromAsset = order.fromAsset;

  return (
    <ContentContainer container width="400px">
      <Subtitle variant="h3" align="center" fontFamily="statusCard">
        {subtitle}
      </Subtitle>

      <AssetsContainer container flexDirection="row" position="relative">
        {fromAsset && (
          <AssetItem amount={order.fromAssetAmount} label="From" {...fromAsset} />
        )}
        {toAsset && <AssetItem amount={order.toAssetAmount} label="To" {...toAsset} />}
      </AssetsContainer>

      <Subtitle variant="h3" align="center" fontFamily="statusCard">
        <Grid display="flex" alignItems="center">
          A fee (besides transaction fees) up to 0.5 ADA to cancel this order might be
          required.
        </Grid>
      </Subtitle>
    </ContentContainer>
  );
};

const AssetItem: FC<AssetItemProps> = ({
  label,
  amount,
  shortName,
  iconUrl,
  decimalPrecision,
}) => (
  <Grid
    container
    item
    key={shortName}
    flexDirection="row"
    width="50%"
    alignContent="center"
    alignItems="center"
    justifyContent="flex-end"
    marginRight="-12px"
    gap="20px"
  >
    <Grid container flexDirection="column" width="fit-content">
      <Typography
        variant="tabsOnProjectsPage"
        fontFamily="secondaryFont"
        color="buttonsInactive.main"
        lineHeight="18px"
        fontSize="14px"
      >
        {label}
      </Typography>
      <Typography
        variant="roundWrapperCardTitle"
        align="center"
        fontFamily="secondaryFont"
        color="textColor"
        fontWeight="600"
      >
        {indivisibleToUnit(amount, decimalPrecision)} {shortName}
      </Typography>
    </Grid>

    <RoundIconWrapper>
      <Avatar src={iconUrl} />
    </RoundIconWrapper>
  </Grid>
);

export type FieldProps = {
  label: string;
  content: string;
  tooltipText?: string;
};

export const Field: FC<FieldProps> = ({ label, content, tooltipText }) => (
  <Grid container justifyContent="space-between">
    <Grid container width="fit-content" gap="5px">
      <Typography
        variant="tabsOnProjectsPage"
        align="left"
        fontFamily="secondaryFont"
        color="buttonsInactive.main"
        lineHeight="20px"
      >
        {label}:
      </Typography>

      {tooltipText && (
        <Tooltip title={tooltipText} placement="top">
          <Grid display="flex" alignItems="center">
            <InfoIcon />
          </Grid>
        </Tooltip>
      )}
    </Grid>

    <Typography
      variant="roundWrapperCardDesc"
      align="right"
      fontFamily="secondaryFont"
      color="textColor"
      fontSize="15px"
    >
      {content}
    </Typography>
  </Grid>
);

type AssetItemProps = Asset & {
  amount: string;
  label: string;
};

export type RemoveOrderDialogActionsProps = {
  isLoading: boolean;
  onClose: () => void;
  onCancel: () => void;
};

const Actions: FC<RemoveOrderDialogActionsProps> = ({ isLoading, onClose, onCancel }) => (
  <Wrapper container>
    <CancelButtonWrapper variant="contained" onClick={onClose}>
      <Typography variant="body3" color="textColor" textAlign="center" fontWeight="500">
        Cancel
      </Typography>
    </CancelButtonWrapper>
    <RemoveButtonWrapper variant="contained" onClick={onCancel}>
      {isLoading && (
        <CircularProgress color="info" size={20} sx={{ marginRight: '10px' }} />
      )}
      <Typography variant="body3" color="textColor" textAlign="center" fontWeight="500">
        Remove order
      </Typography>
    </RemoveButtonWrapper>
  </Wrapper>
);

const Subtitle = styled(Typography)(({ theme }) => ({
  fontSize: '15px',
  fontWeight: '500',
  lineHeight: '24px',
  color: '#C4CFF5',
  width: '80%',
  margin: '0 auto',
  whiteSpace: 'pre-line',

  [theme.breakpoints.down('sm')]: {
    fontSize: '14px',
    fontWeight: '500',
    lineHeight: '20px',
    width: '100%',
  },
}));

const Wrapper = styled(Grid)(({ theme }) => ({
  marginTop: '30px',
  justifyContent: 'space-evenly',

  [theme.breakpoints.down('sm')]: {
    marginTop: '80px',
    flexDirection: 'column-reverse',
    width: '100%',
    gap: '12px',

    '& .MuiButton-root': {
      width: '100%',
    },
  },
}));

const ContentContainer = styled(Grid)(({ theme }) => ({
  marginTop: '35px',

  [theme.breakpoints.down('sm')]: {
    maxWidth: '100%',
    width: '100%',
    marginTop: '16px',
  },
}));

const AssetsContainer = styled(Grid)(({ theme }) => ({
  textAlign: 'right',
  margin: '30px auto',

  '& > .MuiGrid-container:nth-of-type(2)': {
    flexDirection: 'row-reverse',
    textAlign: 'left',
  },

  [theme.breakpoints.down('md')]: {
    '& > .MuiGrid-container': {
      gap: '5px',

      '& > .MuiGrid-root': {
        '& > .MuiTypography-root:first-of-type': {
          fontSize: '13px',
        },

        '& > .MuiTypography-root:last-of-type': {
          fontSize: '15px',
        },
      },
    },
  },

  [theme.breakpoints.down('sm')]: {
    margin: '28px 0 0 0',
  },

  // these rules are needed because after this value the 2 divs with icons overlap
  [theme.breakpoints.down(350)]: {
    flexDirection: 'column',
    alignContent: 'center',
    gap: '10px',
  },
}));

const RoundIconWrapper = styled(Avatar)(({ theme }) => ({
  width: '50px',
  height: '50px',
  margin: '0',
  boxShadow: `0 0 0 3px ${theme.palette.bgCardRoundColor.main}`,
  backgroundColor: 'black',

  '& > div': {
    width: 'inherit',
    height: 'inherit',
  },
}));

export const CancelButtonWrapper = styled(Button)(({ theme }) => ({
  background: theme.palette.lines.main,
  width: '46%',
  height: '55px',
  borderRadius: theme.borderRadius.md,

  textTransform: 'none',
  boxShadow: 'none',

  '&:hover': {
    background: theme.palette.lines.main,
    boxShadow: 'none',
  },
}));

const RemoveButtonWrapper = styled(CancelButtonWrapper)(({ theme }) => ({
  backgroundColor: theme.palette.chip.error.color,

  '&:hover': {
    backgroundColor: theme.palette.chip.error.color,
  },
}));

export default CancelOrderDialog;
