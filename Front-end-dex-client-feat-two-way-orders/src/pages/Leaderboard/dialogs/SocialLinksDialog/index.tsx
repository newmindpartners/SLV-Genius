import { Stack } from '@mui/material';
import { useForm } from 'react-hook-form';
import Button from '~/components/Button/Button';
import { Dialog, DialogTitle } from '~/components/Dialogs/Dialog';
import TextField from '~/components/TextField/TextField';

import { ISocialLinksFormData } from './types/ISocialLinksFormData';

export interface SocialLinksDialogProps {
  open: boolean;
  data?: ISocialLinksFormData;
  onSave: (data: ISocialLinksFormData) => void;
  onClose: () => void;
}

export const SocialLinksDialog = ({
  open,
  data,
  onClose,
  onSave,
}: SocialLinksDialogProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ISocialLinksFormData>({
    defaultValues: data,
  });

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle title="Add social links" onClose={onClose} />

      <Stack minHeight="30rem" justifyContent="space-between">
        <Stack spacing={2}>
          <TextField
            color="secondary"
            caption="X (Twitter): "
            placeholder="Enter your Twitter address"
            error={!!errors.twitter}
            helperText={errors.twitter?.message}
            {...register('twitter')}
          />
          <TextField
            color="secondary"
            caption="Telegram: "
            placeholder="Enter your Telegram address"
            error={!!errors.telegram}
            helperText={errors.telegram?.message}
            {...register('telegram')}
          />
          <TextField
            color="secondary"
            caption="Discord: "
            placeholder="Enter your Discord address"
            error={!!errors.discord}
            helperText={errors.discord?.message}
            {...register('discord')}
          />
        </Stack>

        <Button
          color="gradient"
          sx={{ fontWeight: 'bold' }}
          onClick={handleSubmit(onSave)}
        >
          Save
        </Button>
      </Stack>
    </Dialog>
  );
};
