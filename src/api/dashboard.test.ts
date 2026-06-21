import { describe, expect, test } from '@jest/globals';

import { buildDashboardData } from './dashboard';

describe('dashboard data builder', () => {
  test('builds dashboard metrics and ready-to-render lists', () => {
    const data = buildDashboardData(
      [
        {
          id: 'c',
          name: 'Client',
          phone: '+79990001122',
          email: 'c@b.ru',
          company: 'C',
          createdAt: '2026-06-09',
          createdBy: 'u',
        },
      ],
      [
        {
          id: 'd',
          title: 'Deal',
          clientId: 'c',
          amount: 1,
          status: 'new',
          createdAt: '2026-06-09',
          createdBy: 'u',
        },
      ],
      [],
      new Date('2026-06-09T12:00:00'),
    );

    expect(data.stats.clients.total).toBe(1);
    expect(data.stats.activeDeals.total).toBe(1);
    expect(data.activeClients).toHaveLength(1);
    expect(data.topActiveDeals).toHaveLength(1);
    expect(data.dealTitleById.d).toBe('Deal');
  });
});
