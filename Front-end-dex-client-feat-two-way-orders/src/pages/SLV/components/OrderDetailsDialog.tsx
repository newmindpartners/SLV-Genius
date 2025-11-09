import { Alert, Box, Chip, Grid, styled, Typography } from '@mui/material';
import { FC, useState } from 'react';
import Button from '~/components/Button/Button';
import { Dialog, DialogTitle } from '~/components/Dialogs/Dialog';
import { useSLVApi } from '~/hooks/slv/useSLVApi';
import type { TwoWayOrderList } from '~/redux/api/core';
import { formatNumber } from '~/utils/mathUtils';

interface OrderDetailsDialogProps {
  open: boolean;
  order: TwoWayOrderList[number];
  onClose: () => void;
  onOrderAction: () => void;
}

const OrderDetailsDialog: FC<OrderDetailsDialogProps> = ({
  open,
  order,
  onClose,
  onOrderAction,
}) => {
  const { fillTwoWayOrderByUtxo, cancelTwoWayOrderByUtxo, error } = useSLVApi();
  const [actionLoading, setActionLoading] = useState(false);

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return dateString;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'OPEN':
      case 'PLACED':
        return 'primary';
      case 'FILLED':
        return 'success';
      case 'CANCELLED':
        return 'error';
      default:
        return 'default';
    }
  };

  const handleFillOrder = async () => {
    setActionLoading(true);
    try {
      await fillTwoWayOrderByUtxo(
        `${order.utxoReferenceTransactionHash ?? ''}#${order.utxoReferenceIndex ?? ''}`,
      );
      onOrderAction();
    } catch (err) {
      console.error('Failed to fill order:', err);
    } finally {
      setActionLoading(false);
    }
  };

  const handleCancelOrder = async () => {
    setActionLoading(true);
    try {
      await cancelTwoWayOrderByUtxo(
        `${order.utxoReferenceTransactionHash ?? ''}#${order.utxoReferenceIndex ?? ''}`,
      );
      onOrderAction();
    } catch (err) {
      console.error('Failed to cancel order:', err);
    } finally {
      setActionLoading(false);
    }
  };

  const status = (order.orderStatus as string) || 'UNKNOWN';
  const canFill = status === 'OPEN' || status === 'PLACED';
  const canCancel = status === 'OPEN' || status === 'PLACED';

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle title="Order Details" onClose={onClose} />
      <Box sx={{ mt: 2 }}>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        <Grid container spacing={3}>
          <DetailSection>
            <DetailItem>
              <Typography variant="subtitle2" color="text.secondary">
                Order ID
              </Typography>
              <Typography variant="body1">#{order.twoWayOrderId.slice(-6)}</Typography>
            </DetailItem>
            <DetailItem>
              <Typography variant="subtitle2" color="text.secondary">
                Status
              </Typography>
              <Chip label={status} color={getStatusColor(status)} size="small" />
            </DetailItem>
          </DetailSection>

          <DetailSection>
            <Typography variant="h6" gutterBottom>
              Offer Details
            </Typography>
            <DetailItem>
              <Typography variant="subtitle2" color="text.secondary">
                Amount
              </Typography>
              <Typography variant="body1">
                {formatNumber(order.fromAssetAmount)}
              </Typography>
            </DetailItem>
            <DetailItem>
              <Typography variant="subtitle2" color="text.secondary">
                Token
              </Typography>
              <Typography variant="body1">{order.fromAssetId}</Typography>
            </DetailItem>
          </DetailSection>

          <DetailSection>
            <Typography variant="h6" gutterBottom>
              Price Details
            </Typography>
            <DetailItem>
              <Typography variant="subtitle2" color="text.secondary">
                Amount
              </Typography>
              <Typography variant="body1">{order.price}</Typography>
            </DetailItem>
            <DetailItem>
              <Typography variant="subtitle2" color="text.secondary">
                Token
              </Typography>
              <Typography variant="body1">{order.toAssetId}</Typography>
            </DetailItem>
          </DetailSection>

          <DetailSection>
            <Typography variant="h6" gutterBottom>
              Timing
            </Typography>
            <DetailItem>
              <Typography variant="subtitle2" color="text.secondary">
                End Date
              </Typography>
              <Typography variant="body1">
                {order.effectiveUntilDate ? formatDate(order.effectiveUntilDate) : '-'}
              </Typography>
            </DetailItem>
            {order.created && (
              <DetailItem>
                <Typography variant="subtitle2" color="text.secondary">
                  Created
                </Typography>
                <Typography variant="body1">{formatDate(order.created)}</Typography>
              </DetailItem>
            )}
            {order.updated && (
              <DetailItem>
                <Typography variant="subtitle2" color="text.secondary">
                  Updated
                </Typography>
                <Typography variant="body1">{formatDate(order.updated)}</Typography>
              </DetailItem>
            )}
          </DetailSection>
        </Grid>
        <DialogActions>
          <Button onClick={onClose} disabled={actionLoading}>
            Close
          </Button>
          {canFill && (
            <Button onClick={handleFillOrder} color="primary" disabled={actionLoading}>
              Fill Order
            </Button>
          )}
          {canCancel && (
            <Button onClick={handleCancelOrder} color="error" disabled={actionLoading}>
              Cancel Order
            </Button>
          )}
        </DialogActions>
      </Box>
    </Dialog>
  );
};

const DetailItem = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(2),
}));

const DetailSection = styled(Grid)(({ theme }) => ({
  marginBottom: theme.spacing(3),
}));

const DialogActions = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'flex-end',
  gap: theme.spacing(2),
  marginTop: theme.spacing(3),
}));

export default OrderDetailsDialog;
