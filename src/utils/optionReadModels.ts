import type { Client } from '../types/client';
import type { Deal } from '../types/deal';
import type { EntityOption } from '../types/options';
import type { User } from '../types/user';
import { getUserDisplayName } from './users';

export function createClientOptions(clients: Client[]): EntityOption[] {
  return clients.map((client) => ({
    value: client.id,
    label: `${client.name} · ${client.company}`,
  }));
}

export function createDealOptions(deals: Deal[]): EntityOption[] {
  return deals.map((deal) => ({ value: deal.id, label: deal.title }));
}

export function createUserOptions(users: User[]): EntityOption[] {
  return users.map((user) => ({
    value: user.id,
    label: getUserDisplayName(user),
  }));
}
