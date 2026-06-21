import type { Deal } from '../../types/deal';
import type { DealFormValues } from './dealSchemas';

export function toDealPayload(
  values: DealFormValues,
  userId: string,
): Omit<Deal, 'completedAt'> & Partial<Pick<Deal, 'completedAt'>> {
  return {
    id: crypto.randomUUID(),
    title: values.title,
    clientId: values.clientId,
    description: values.description,
    amount: Number(values.amount),
    status: values.status,
    createdAt: new Date(values.createdAt).toISOString(),
    completedAt: values.completedAt
      ? new Date(values.completedAt).toISOString()
      : undefined,
    createdBy: userId,
  };
}
