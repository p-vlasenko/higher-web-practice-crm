import { describe, expect, test } from '@jest/globals';

import { reportFilterSchema } from './reportSchemas';

describe('report filter schema', () => {
  test('rejects inverted date ranges', () => {
    expect(
      reportFilterSchema.safeParse({
        dateFrom: '2026-06-10',
        dateTo: '2026-06-01',
      }).success,
    ).toBe(false);
    expect(
      reportFilterSchema.safeParse({
        dateFrom: '2026-06-01',
        dateTo: '2026-06-10',
      }).success,
    ).toBe(true);
  });
});
