import { z } from 'zod';

import {
  emailSchema,
  phoneSchema,
  requiredString,
  urlSchema,
} from '../../utils/validation';

export const clientSchema = z.object({
  name: requiredString(),
  phone: phoneSchema,
  email: emailSchema,
  company: requiredString(),
  website: urlSchema,
  createdAt: requiredString(),
  comment: z.string().trim().optional(),
});

export type ClientFormValues = z.infer<typeof clientSchema>;
