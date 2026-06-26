import { describe, expect, it } from '@jest/globals';

import { buildStageRows } from '../features/reports/reportSelectors';

describe('performance contracts', () => {
  it('report grouping handles 1000 records quickly', () => {
    const deals = Array.from({ length: 1000 }, (_, index) => ({
      id: String(index),
      title: `Deal ${index}`,
      clientId: 'client',
      amount: index,
      status: 'new' as const,
      createdAt: '2026-01-01',
      createdBy: 'u',
    }));
    const started = performance.now();
    expect(
      buildStageRows(deals).find((row) => row.stage === 'new')?.dealsCount,
    ).toBe(1000);
    expect(performance.now() - started).toBeLessThan(2000);
  });
});
