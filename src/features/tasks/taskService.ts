import type { Task } from '../../types/task';
import type { TaskFormValues } from './taskSchemas';

export function toTaskPayload(values: TaskFormValues, userId: string): Task {
  return {
    id: crypto.randomUUID(),
    title: values.title,
    description: values.description,
    dealId: values.dealId,
    dueDate: values.dueDate
      ? new Date(values.dueDate).toISOString()
      : undefined,
    assigneeId: values.assigneeId,
    status: values.status,
    createdAt: new Date().toISOString(),
    createdBy: userId,
  };
}
