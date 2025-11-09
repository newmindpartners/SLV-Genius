import { Alert, Box, Button, Grid, styled, TextField } from '@mui/material';
import { FC } from 'react';
import { AlertType } from '~/components/Dialogs/AlertDialog';
import { Dialog, DialogTitle } from '~/components/Dialogs/Dialog';
import { useAlertDialog } from '~/context/alertDialog';
import { useSLVApi } from '~/hooks/slv/useSLVApi';
import { useTwoWayOrderForm } from '~/hooks/slv/useTwoWayOrderForm';
import useTwoWayOrderSubmit from '~/hooks/slv/useTwoWayOrderSubmit';
import TextFieldIconSelect from '~/pages/Swap/components/OrderCard/components/TextFieldIconSelect/TextFieldIconSelect';

interface CreateOrderDialogProps {
  open: boolean;
  onClose: () => void;
  onOrderCreated: () => void;
}

const CreateOrderDialog: FC<CreateOrderDialogProps> = ({
  open,
  onClose,
  onOrderCreated,
}) => {
  const { isLoading, error } = useSLVApi();
  const { onDialogOpen: openAlertDialog } = useAlertDialog();
  const {
    assetOptions,
    draft,
    fromOption,
    toOption,
    isValid,
    setFieldValue,
    selectFrom,
    selectTo,
    resetForm,
    buildSubmissionPayload,
  } = useTwoWayOrderForm({
    defaultAssetShortNames: {
      from: 'ADA',
      to: 'GENS',
    },
  });
  const { placeTwoWayOrder, isSubmitting } = useTwoWayOrderSubmit({
    onSuccess: () => {
      openAlertDialog({
        alertType: AlertType.Success,
        title: 'Transaction signing successful!',
        description: 'Order placed. Waiting for confirmation on chain.',
      });
      onOrderCreated();
      resetForm();
      onClose();
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = buildSubmissionPayload();

    if (!payload) {
      openAlertDialog({
        alertType: AlertType.Failure,
        title: 'Invalid asset selection',
        description: 'Selected assets are not available. Please reselect and try again.',
      });
      return;
    }

    placeTwoWayOrder(payload);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle title="Create Two-Way Order" onClose={onClose} />
      <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        <Grid container spacing={3} direction="column">
          <Grid item xs={12} sm={6}>
            <TextFieldIconSelect
              title="From"
              selectedOption={fromOption}
              availableOptions={assetOptions}
              setSelectedOption={selectFrom}
              textField={{
                value: draft.fromAssetAmount,
                onChange: (v) => setFieldValue('fromAssetAmount', v),
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Effective From"
              type="datetime-local"
              value={draft.effectiveFromDate || ''}
              onChange={(e) => setFieldValue('effectiveFromDate', e.target.value)}
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextFieldIconSelect
              title="To"
              selectedOption={toOption}
              availableOptions={assetOptions}
              setSelectedOption={selectTo}
              textField={{
                value: draft.toAssetAmount,
                onChange: (v) => setFieldValue('toAssetAmount', v),
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Effective Until"
              type="datetime-local"
              value={draft.effectiveUntilDate || ''}
              onChange={(e) => setFieldValue('effectiveUntilDate', e.target.value)}
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Grid>
        </Grid>
        <DialogActions>
          <Button
            onClick={() => {
              resetForm();
              onClose();
            }}
            disabled={isLoading || isSubmitting}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            color="primary"
            disabled={!isValid || isLoading || isSubmitting}
          >
            Create Order
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
};

const DialogActions = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'flex-end',
  gap: theme.spacing(2),
  marginTop: theme.spacing(3),
}));

export default CreateOrderDialog;
