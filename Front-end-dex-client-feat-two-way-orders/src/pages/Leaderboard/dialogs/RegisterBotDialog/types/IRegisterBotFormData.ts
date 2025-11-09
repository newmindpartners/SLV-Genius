import { z } from 'zod';

import { registerBotFormSchema } from '../schemas/registerBotFormSchema';

export type IRegisterBotFormData = z.infer<typeof registerBotFormSchema>;
