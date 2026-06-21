import type { Client, CreateClientPayload } from '../../types/client';
import type { ClientFormValues } from './clientSchemas';

export function toClientPayload(
  values: ClientFormValues,
  userId: string,
): CreateClientPayload &
  Pick<Client, 'id' | 'createdAt' | 'createdBy' | 'deleted'> {
  return {
    id: crypto.randomUUID(),
    name: values.name,
    phone: values.phone,
    email: values.email,
    company: values.company,
    website: values.website,
    comment: values.comment,
    createdAt: new Date(values.createdAt).toISOString(),
    deleted: false,
    createdBy: userId,
  };
}
