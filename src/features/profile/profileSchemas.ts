import { z } from 'zod';

import {
  emailSchema,
  passwordSchema,
  requiredString,
} from '../../utils/validation';

export const profileSchema = z
  .object({
    accountName: requiredString(),
    email: emailSchema,
    firstName: requiredString(),
    lastName: requiredString(),
    currentPassword: z.string().optional(),
    newPassword: z.union([passwordSchema, z.literal('')]).optional(),
    passwordRepeat: z.string().optional(),
  })
  .superRefine((values, context) => {
    if (!values.newPassword) return;

    if (!values.currentPassword) {
      context.addIssue({
        code: 'custom',
        message: 'Введите текущий пароль',
        path: ['currentPassword'],
      });
    }

    if (values.passwordRepeat !== values.newPassword) {
      context.addIssue({
        code: 'custom',
        message: 'Пароли не совпадают',
        path: ['passwordRepeat'],
      });
    }
  });

export type ProfileFormValues = z.infer<typeof profileSchema>;
