import type { Client } from '../../types/client';
import type { Deal, DealStatus } from '../../types/deal';
import type { Task } from '../../types/task';
import type { User } from '../../types/user';
import { isDateInRange } from '../../utils/periods';
import { isOverdue } from '../../utils/tasks';
import { getUserDisplayName } from '../../utils/users';

export function buildSalesRows(
  deals: Deal[],
  clients: Client[],
  from?: string,
  to?: string,
) {
  return deals
    .filter(
      (deal) =>
        deal.status === 'completed' &&
        isDateInRange(deal.completedAt, from, to),
    )
    .map((deal) => ({
      dealId: deal.id,
      title: deal.title,
      clientName:
        clients.find((client) => client.id === deal.clientId)?.name ??
        'Удалённый клиент',
      amount: deal.amount,
      completedAt: deal.completedAt ?? '',
    }));
}

export function buildStageRows(deals: Deal[], from?: string, to?: string) {
  const scopedDeals = deals.filter((deal) =>
    isDateInRange(deal.completedAt ?? deal.createdAt, from, to),
  );
  const stages: DealStatus[] = ['new', 'in_progress', 'completed', 'cancelled'];

  return stages.map((stage) => {
    const stageDeals = scopedDeals.filter((deal) => deal.status === stage);

    return {
      stage,
      dealsCount: stageDeals.length,
      totalAmount: stageDeals.reduce((sum, deal) => sum + deal.amount, 0),
    };
  });
}

export function buildNewClientRows(
  clients: Client[],
  from?: string,
  to?: string,
) {
  return clients
    .filter((client) => isDateInRange(client.createdAt, from, to))
    .map((client) => ({
      clientId: client.id,
      clientName: client.name,
      company: client.company,
      createdAt: client.createdAt,
    }));
}

export function buildClientActivityRows(
  clients: Client[],
  deals: Deal[],
  tasks: Task[],
  from?: string,
  to?: string,
) {
  return clients.map((client) => ({
    clientId: client.id,
    clientName: client.name,
    dealsCount: deals.filter(
      (deal) =>
        deal.clientId === client.id && isDateInRange(deal.createdAt, from, to),
    ).length,
    completedTasks: tasks.filter(
      (task) =>
        task.status === 'completed' &&
        isDateInRange(task.createdAt, from, to) &&
        deals.some(
          (deal) => deal.id === task.dealId && deal.clientId === client.id,
        ),
    ).length,
  }));
}

export function buildOverdueTaskRows(
  tasks: Task[],
  users: User[],
  now = new Date(),
  from?: string,
  to?: string,
) {
  return tasks
    .filter(
      (task) => isOverdue(task, now) && isDateInRange(task.dueDate, from, to),
    )
    .map((task) => {
      const assignee = users.find((user) => user.id === task.assigneeId);

      return {
        taskId: task.id,
        title: task.title,
        assigneeName: assignee ? getUserDisplayName(assignee) : 'Не назначен',
        dueDate: task.dueDate ?? '',
        status: task.status,
      };
    });
}
