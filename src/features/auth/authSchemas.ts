import { z } from 'zod';

import {
  emailSchema,
  passwordSchema,
  requiredString,
} from '../../utils/validation';

export const loginSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});

export const registrationSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  name: requiredString(),
});

export type LoginFormValues = z.infer<typeof loginSchema>;
export type RegistrationFormValues = z.infer<typeof registrationSchema>;
