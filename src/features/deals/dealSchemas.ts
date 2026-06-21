import { z } from 'zod';

import {
  nonNegativeAmountSchema,
  requiredString,
} from '../../utils/validation';

export const dealStatuses = [
  'new',
  'in_progress',
  'completed',
  'cancelled',
] as const;

export const dealSchema = z
  .object({
    title: requiredString(),
    clientId: requiredString(),
    description: z.string().trim().optional(),
    amount: nonNegativeAmountSchema,
    status: z.enum(dealStatuses),
    createdAt: requiredString(),
    completedAt: z.string().optional(),
  })
  .refine(
    (value) => value.status !== 'completed' || Boolean(value.completedAt),
    {
      path: ['completedAt'],
      message: 'Дата завершения обязательна',
    },
  )
  .refine(
    (value) =>
      !value.completedAt ||
      new Date(value.completedAt) >= new Date(value.createdAt),
    {
      path: ['completedAt'],
      message: 'Дата завершения не может быть раньше создания',
    },
  );

export type DealFormValues = z.infer<typeof dealSchema>;
