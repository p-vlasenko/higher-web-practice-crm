import { describe, expect, test } from '@jest/globals';

import { buildSalesRows, buildStageRows } from './reportSelectors';

describe('report selectors', () => {
  test('builds sales and stage rows', () => {
    const deals = [
      {
        id: 'd',
        title: 'Deal',
        clientId: 'c',
        amount: 10,
        status: 'completed' as const,
        createdAt: '2026-01-01',
        completedAt: '2026-01-02',
        createdBy: 'u',
      },
    ];
    const clients = [
      {
        id: 'c',
        name: 'Client',
        phone: '+79990001122',
        email: 'c@b.ru',
        company: 'C',
        createdAt: '2026-01-01',
        createdBy: 'u',
      },
    ];
    expect(buildSalesRows(deals, clients)).toHaveLength(1);
    expect(
      buildStageRows(deals).find((row) => row.stage === 'completed')
        ?.dealsCount,
    ).toBe(1);
  });
});
