import type { DashboardResponse } from '../../types/dashboard';

export const defaultDashboard: DashboardResponse = {
  activeClients: [],
  activeDealsQuarter: 0,
  clients: [],
  completedQuarter: 0,
  dealCountByClientId: {},
  deals: [],
  dealTitleById: {},
  recentDeals: [],
  recentTasks: [],
  stats: {
    clients: { total: 0, today: 0, week: 0, month: 0, quarter: 0 },
    activeDeals: { total: 0, today: 0, week: 0, month: 0 },
    completedDeals: { total: 0, today: 0, week: 0, month: 0 },
  },
  topActiveDeals: [],
  topClients: [],
};
