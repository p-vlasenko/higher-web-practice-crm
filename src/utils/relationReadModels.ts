import type { Client } from '../types/client';
import type { Deal } from '../types/deal';
import type { Task } from '../types/task';
import type { User } from '../types/user';
import { getUserDisplayName } from './users';

export type DealTableRow = Deal & {
  clientName: string;
};

export type TaskTableRow = Task & {
  assigneeName: string;
  dealTitle: string;
};

function createNameLookup<T extends { id: string; name: string }>(items: T[]) {
  return new Map(items.map((item) => [item.id, item.name]));
}

export function createClientNameResolver(clients: Client[]) {
  const clientNameById = createNameLookup(clients);

  return (clientId: string) =>
    clientNameById.get(clientId) ?? 'Удалённый клиент';
}

export function createDealTitleResolver(deals: Deal[]) {
  const dealTitleById = new Map(deals.map((deal) => [deal.id, deal.title]));

  return (dealId?: string) =>
    (dealId ? dealTitleById.get(dealId) : undefined) ?? '-';
}

export function createUserNameResolver(users: User[]) {
  const userNameById = new Map(
    users.map((user) => [user.id, getUserDisplayName(user)]),
  );

  return (userId: string) => userNameById.get(userId) ?? '-';
}

export function createDealTableRows(
  deals: Deal[],
  clients: Client[],
): DealTableRow[] {
  const resolveClientName = createClientNameResolver(clients);

  return deals.map((deal) => ({
    ...deal,
    clientName: resolveClientName(deal.clientId),
  }));
}

export function createTaskTableRows(
  tasks: Task[],
  deals: Deal[],
  users: User[],
): TaskTableRow[] {
  const resolveDealTitle = createDealTitleResolver(deals);
  const resolveUserName = createUserNameResolver(users);

  return tasks.map((task) => ({
    ...task,
    assigneeName: resolveUserName(task.assigneeId),
    dealTitle: resolveDealTitle(task.dealId),
  }));
}
