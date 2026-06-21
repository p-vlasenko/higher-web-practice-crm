import { z } from 'zod';

import { requiredString } from '../../utils/validation';

export const taskStatuses = ['new', 'in_progress', 'completed'] as const;

export const taskSchema = z.object({
  title: requiredString(),
  dealId: z.string().optional(),
  description: z.string().trim().optional(),
  dueDate: z.string().optional(),
  assigneeId: requiredString(),
  status: z.enum(taskStatuses),
});

export type TaskFormValues = z.infer<typeof taskSchema>;
