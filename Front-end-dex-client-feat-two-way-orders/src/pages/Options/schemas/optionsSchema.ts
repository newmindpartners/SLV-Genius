import { z } from 'zod';

export const optionsSchema = z.object({
  deposit: z.string().min(1),
  payment: z.string().min(1),
  price: z.string().min(1),
  amount: z.string().min(1),
  endDate: z.date(),
});

export type IOptionsFormData = z.infer<typeof optionsSchema>;
