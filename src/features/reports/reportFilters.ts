import { getPeriodStart } from '../../utils/periods';
import {
  reportFilterSchema,
  type ReportFilterValues,
} from './reportSchemas';

export const reportFilterDefaults = reportFilterSchema.parse({});

export function parseReportFilters(values: unknown): ReportFilterValues {
  const result = reportFilterSchema.safeParse(values);

  return result.success ? result.data : reportFilterDefaults;
}

export function parseReportFiltersFromSearchParams(
  searchParams: URLSearchParams,
): ReportFilterValues {
  return parseReportFilters({
    period: searchParams.get('period') ?? undefined,
    dateFrom: searchParams.get('dateFrom') ?? undefined,
    dateTo: searchParams.get('dateTo') ?? undefined,
    dealStatus: searchParams.get('dealStatus') ?? undefined,
    managerId: searchParams.get('managerId') ?? undefined,
  });
}

export function writeReportFiltersToSearchParams(
  searchParams: URLSearchParams,
  filters: ReportFilterValues,
) {
  const nextParams = new URLSearchParams(searchParams);

  setOptionalSearchParam(
    nextParams,
    'period',
    filters.period === reportFilterDefaults.period ? undefined : filters.period,
  );
  setOptionalSearchParam(nextParams, 'dateFrom', filters.dateFrom);
  setOptionalSearchParam(nextParams, 'dateTo', filters.dateTo);
  setOptionalSearchParam(nextParams, 'dealStatus', filters.dealStatus);
  setOptionalSearchParam(nextParams, 'managerId', filters.managerId);

  return nextParams;
}

export function getReportFilterRange(
  filters: ReportFilterValues,
  now = new Date(),
) {
  return {
    dateFrom:
      filters.dateFrom ?? getPeriodStart(filters.period, now).toISOString(),
    dateTo: filters.dateTo ?? now.toISOString(),
    now,
  };
}

function setOptionalSearchParam(
  params: URLSearchParams,
  key: string,
  value: string | undefined,
) {
  if (value) {
    params.set(key, value);
    return;
  }

  params.delete(key);
}
