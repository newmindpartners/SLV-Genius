import { z } from 'zod';

export const registerBotFormSchema = z.object({
  tradingWalletStakeKeyHash: z.string().min(1, 'Required'),
  assetTwoId: z.string().min(1, 'Required'),
  twitter: z.string().optional(),
  telegram: z.string().optional(),
  discord: z.string().optional(),
});
