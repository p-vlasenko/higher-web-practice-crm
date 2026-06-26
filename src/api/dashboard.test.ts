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

  test('excludes deleted clients from top active clients', () => {
    const data = buildDashboardData(
      [
        {
          id: 'active',
          name: 'Active Client',
          phone: '+79990001122',
          email: 'active@example.test',
          company: 'A',
          createdAt: '2026-06-09',
          createdBy: 'u',
          deleted: false,
        },
        {
          id: 'deleted',
          name: 'Deleted Client',
          phone: '+79990001123',
          email: 'deleted@example.test',
          company: 'D',
          createdAt: '2026-06-09',
          createdBy: 'u',
          deleted: true,
        },
      ],
      [
        {
          id: 'd1',
          title: 'Active Deal',
          clientId: 'active',
          amount: 1,
          status: 'new',
          createdAt: '2026-06-09',
          createdBy: 'u',
        },
        {
          id: 'd2',
          title: 'Deleted Deal 1',
          clientId: 'deleted',
          amount: 1,
          status: 'new',
          createdAt: '2026-06-09',
          createdBy: 'u',
        },
        {
          id: 'd3',
          title: 'Deleted Deal 2',
          clientId: 'deleted',
          amount: 1,
          status: 'new',
          createdAt: '2026-06-09',
          createdBy: 'u',
        },
      ],
      [],
      new Date('2026-06-09T12:00:00'),
    );

    expect(data.topClients.map((client) => client.id)).toEqual(['active']);
  });
});
