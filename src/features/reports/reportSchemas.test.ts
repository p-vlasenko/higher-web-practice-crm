import { describe, expect, test } from '@jest/globals';

import {
  getReportFilterRange,
  parseReportFilters,
  parseReportFiltersFromSearchParams,
  reportFilterDefaults,
  writeReportFiltersToSearchParams,
} from './reportFilters';
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

  test('normalizes filters through schema defaults', () => {
    expect(parseReportFilters({ period: 'unknown' })).toEqual(
      reportFilterDefaults,
    );
    expect(
      parseReportFilters({
        period: 'month',
        dateFrom: '',
        dateTo: '2026-06-10',
        dealStatus: 'completed',
      }),
    ).toEqual({
      period: 'month',
      dateFrom: undefined,
      dateTo: '2026-06-10',
      dealStatus: 'completed',
      managerId: undefined,
    });
  });

  test('uses the same schema for URL search params', () => {
    const filters = parseReportFiltersFromSearchParams(
      new URLSearchParams('period=quarter&dealStatus=cancelled'),
    );
    const searchParams = writeReportFiltersToSearchParams(
      new URLSearchParams('tab=sales'),
      filters,
    );

    expect(filters.period).toBe('quarter');
    expect(filters.dealStatus).toBe('cancelled');
    expect(searchParams.toString()).toBe(
      'tab=sales&period=quarter&dealStatus=cancelled',
    );
  });

  test('derives report ranges from normalized filters', () => {
    expect(
      getReportFilterRange(
        parseReportFilters({
          period: 'week',
          dateFrom: '2026-06-01',
          dateTo: '2026-06-10',
        }),
        new Date('2026-06-26T12:00:00.000Z'),
      ),
    ).toMatchObject({
      dateFrom: '2026-06-01',
      dateTo: '2026-06-10',
    });
  });
});
