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

export const registrationSchema = z
  .object({
    accountName: requiredString(),
    email: emailSchema,
    firstName: requiredString(),
    lastName: requiredString(),
    password: passwordSchema,
    passwordRepeat: requiredString(),
  })
  .refine((values) => values.password === values.passwordRepeat, {
    message: 'Пароли не совпадают',
    path: ['passwordRepeat'],
  });

export type LoginFormValues = z.infer<typeof loginSchema>;
export type RegistrationFormValues = z.infer<typeof registrationSchema>;
