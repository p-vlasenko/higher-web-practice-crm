import type { Client } from '../types/client';
import type { DashboardResponse } from '../types/dashboard';
import type { Deal } from '../types/deal';
import type { Task } from '../types/task';
import { isWithinPeriod } from '../utils/periods';

const previewLimit = 10;

function isActiveDeal(deal: Deal) {
  return deal.status === 'new' || deal.status === 'in_progress';
}

export function buildDashboardData(
  clients: Client[],
  deals: Deal[],
  tasks: Task[],
  now = new Date(),
): DashboardResponse {
  const activeClients = clients.filter((client) => client.deleted !== true);
  const activeDeals = deals.filter(isActiveDeal);

  const completedDeals = deals.filter((deal) => deal.status === 'completed');

  const countByPeriod = (
    items: { createdAt: string }[],
    period: 'today' | 'week' | 'month' | 'quarter',
  ) =>
    items.filter((item) => isWithinPeriod(item.createdAt, period, now)).length;

  const dealCountByClientId = Object.fromEntries(
    clients.map((client) => [
      client.id,
      deals.filter((deal) => deal.clientId === client.id).length,
    ]),
  );

  return {
    activeClients,
    activeDealsQuarter: activeDeals.filter((deal) =>
      isWithinPeriod(deal.createdAt, 'quarter', now),
    ).length,
    clients,
    completedQuarter: completedDeals.filter((deal) =>
      isWithinPeriod(deal.completedAt, 'quarter', now),
    ).length,
    dealCountByClientId,
    deals,
    dealTitleById: Object.fromEntries(
      deals.map((deal) => [deal.id, deal.title]),
    ),
    recentDeals: activeDeals
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      )
      .slice(0, previewLimit),
    recentTasks: [...tasks]
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      )
      .slice(0, previewLimit),
    stats: {
      clients: {
        total: clients.length,
        today: countByPeriod(clients, 'today'),
        week: countByPeriod(clients, 'week'),
        month: countByPeriod(clients, 'month'),
        quarter: countByPeriod(clients, 'quarter'),
      },
      activeDeals: {
        total: activeDeals.length,
        today: countByPeriod(activeDeals, 'today'),
        week: countByPeriod(activeDeals, 'week'),
        month: countByPeriod(activeDeals, 'month'),
      },
      completedDeals: {
        total: completedDeals.length,
        today: completedDeals.filter((deal) =>
          isWithinPeriod(deal.completedAt, 'today', now),
        ).length,
        week: completedDeals.filter((deal) =>
          isWithinPeriod(deal.completedAt, 'week', now),
        ).length,
        month: completedDeals.filter((deal) =>
          isWithinPeriod(deal.completedAt, 'month', now),
        ).length,
      },
    },
    topActiveDeals: [...activeDeals]
      .sort((a, b) => b.amount - a.amount)
      .slice(0, previewLimit),
    topClients: clients
      .map((client) => ({
        client,
        count: dealCountByClientId[client.id] ?? 0,
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, previewLimit)
      .map((item) => item.client),
  };
}
