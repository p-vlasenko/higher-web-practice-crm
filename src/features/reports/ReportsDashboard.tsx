import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

import {
  useGetClientActivityReportQuery,
  useGetNewClientsReportQuery,
  useGetOverdueTasksReportQuery,
  useGetSalesReportQuery,
  useGetStageReportQuery,
} from '../../api/endpoints/crmEndpoints';
import type {
  ReportPage,
  ReportQueryParams,
  ReportSortKey,
} from '../../types/reports';
import type { SortState } from '../../utils/sorting';
import {
  parseReportFiltersFromSearchParams,
  writeReportFiltersToSearchParams,
} from './reportFilters';
import { ReportSection } from './ReportSection';
import { ReportTable } from './ReportTable';
import { ReportTabs } from './ReportTabs';
import {
  clientActivityReportColumns,
  newClientReportColumns,
  overdueTaskReportColumns,
  salesReportColumns,
  stageReportColumns,
  toClientActivityReportTableRows,
  toNewClientReportTableRows,
  toOverdueTaskReportTableRows,
  toSalesReportTableRows,
  toStageReportTableRows,
} from './reportTableRows';
import type {
  ReportCardVariant,
  ReportColumn,
  ReportTab,
  ReportTableRow,
} from './reportTypes';
import type { ReportFilterValues } from './reportSchemas';

const reportsPageSize = 10;
const emptyReportPage: ReportPage<never> = {
  items: [],
  total: 0,
  unfilteredTotal: 0,
};

type ReportId =
  | 'sales'
  | 'stages'
  | 'newClients'
  | 'clientActivity'
  | 'overdueTasks';

type ReportQueryHook<Row> = (params: ReportQueryParams) => {
  data?: ReportPage<Row>;
};

type ReportConfig<Row> = {
  id: ReportId;
  tab: ReportTab;
  title: string;
  queryHook: ReportQueryHook<Row>;
  columns: ReportColumn[];
  toRows: (rows: Row[]) => ReportTableRow[];
  variant: ReportCardVariant;
  danger?: boolean;
};

type NormalizedReportConfig = Omit<
  ReportConfig<unknown>,
  'queryHook' | 'toRows'
> & {
  queryHook: ReportQueryHook<unknown>;
  toRows: (rows: unknown[]) => ReportTableRow[];
};

function createReportConfig<Row>(
  config: ReportConfig<Row>,
): NormalizedReportConfig {
  return {
    ...config,
    queryHook: config.queryHook as ReportQueryHook<unknown>,
    toRows: (rows) => config.toRows(rows as Row[]),
  };
}

const reportsConfig = [
  createReportConfig({
    id: 'sales',
    tab: 'sales',
    title: 'Общий, продажи',
    queryHook: useGetSalesReportQuery,
    columns: salesReportColumns,
    toRows: toSalesReportTableRows,
    variant: 'salesSummary',
  }),
  createReportConfig({
    id: 'stages',
    tab: 'sales',
    title: 'Этапы сделок',
    queryHook: useGetStageReportQuery,
    columns: stageReportColumns,
    toRows: toStageReportTableRows,
    variant: 'dealStages',
  }),
  createReportConfig({
    id: 'newClients',
    tab: 'clients',
    title: 'Новые клиенты',
    queryHook: useGetNewClientsReportQuery,
    columns: newClientReportColumns,
    toRows: toNewClientReportTableRows,
    variant: 'newClients',
  }),
  createReportConfig({
    id: 'clientActivity',
    tab: 'clients',
    title: 'Активности клиентов',
    queryHook: useGetClientActivityReportQuery,
    columns: clientActivityReportColumns,
    toRows: toClientActivityReportTableRows,
    variant: 'clientActivity',
  }),
  createReportConfig({
    id: 'overdueTasks',
    tab: 'tasks',
    title: 'Просроченные задачи',
    queryHook: useGetOverdueTasksReportQuery,
    columns: overdueTaskReportColumns,
    toRows: toOverdueTaskReportTableRows,
    variant: 'overdueTasks',
    danger: true,
  }),
] as const;

type ReportsDashboardProps = {
  userId?: string;
};

export function ReportsDashboard({ userId }: ReportsDashboardProps) {
  const [activeTab, setActiveTab] = useState<ReportTab>('sales');
  const reportRequests = useReportRequests();
  const [searchParams, setSearchParams] = useSearchParams();
  const reportFilters = useMemo(
    () => parseReportFiltersFromSearchParams(searchParams),
    [searchParams],
  );
  const setReportPeriod = useCallback(
    (period: ReportFilterValues['period']) => {
      const nextFilters = { ...reportFilters, period };

      setSearchParams(
        writeReportFiltersToSearchParams(searchParams, nextFilters),
        { replace: true },
      );
      reportRequests.resetPages();
    },
    [reportFilters, reportRequests, searchParams, setSearchParams],
  );
  const activeReports = reportsConfig.filter(
    (report) => report.tab === activeTab,
  );

  return (
    <>
      <ReportTabs activeTab={activeTab} onTabChange={setActiveTab} />

      {activeReports.map((report) => (
        <ReportConfigSection
          config={report}
          filters={reportFilters}
          key={report.id}
          request={reportRequests[report.id]}
          onPeriodChange={setReportPeriod}
          userId={userId}
        />
      ))}
    </>
  );
}

type ReportRequests = Record<ReportId, ReportRequestState> & {
  resetPages: () => void;
};

function useReportRequests(): ReportRequests {
  const sales = useReportRequestState();
  const stages = useReportRequestState();
  const newClients = useReportRequestState();
  const clientActivity = useReportRequestState();
  const overdueTasks = useReportRequestState();
  const resetPages = useCallback(() => {
    sales.setPage(1);
    stages.setPage(1);
    newClients.setPage(1);
    clientActivity.setPage(1);
    overdueTasks.setPage(1);
  }, [clientActivity, newClients, overdueTasks, sales, stages]);

  return useMemo(
    () => ({
      sales,
      stages,
      newClients,
      clientActivity,
      overdueTasks,
      resetPages,
    }),
    [clientActivity, newClients, overdueTasks, resetPages, sales, stages],
  );
}

type ReportConfigSectionProps = {
  config: NormalizedReportConfig;
  filters: ReportFilterValues;
  onPeriodChange: (period: ReportFilterValues['period']) => void;
  request: ReportRequestState;
  userId?: string;
};

function ReportConfigSection({
  config,
  filters,
  onPeriodChange,
  request,
  userId,
}: ReportConfigSectionProps) {
  const { data = emptyReportPage } = config.queryHook(
    getReportQueryParams(userId, filters, request),
  );

  useEffect(() => {
    request.clampPage(data.total);
  }, [data.total, request]);

  return (
    <ReportSection
      title={config.title}
      currentPage={request.page}
      period={filters.period}
      totalPages={getTotalPages(data)}
      onPageChange={request.setPage}
      onPeriodChange={onPeriodChange}
    >
      <ReportTable
        danger={config.danger}
        variant={config.variant}
        columns={config.columns}
        rows={config.toRows(data.items)}
        sort={request.sort}
        onSortChange={request.setSort}
      />
    </ReportSection>
  );
}

type ReportRequestState = {
  page: number;
  sort: SortState<ReportSortKey> | null;
  clampPage: (total: number) => void;
  setPage: (page: number) => void;
  setSort: (sort: SortState<ReportSortKey>) => void;
};

function useReportRequestState(): ReportRequestState {
  const [page, setPage] = useState(1);
  const [sort, setSortState] = useState<SortState<ReportSortKey> | null>(null);
  const totalPages = useCallback(
    (total: number) => Math.max(1, Math.ceil(total / reportsPageSize)),
    [],
  );
  const clampPage = useCallback(
    (total: number) => {
      const maxPage = totalPages(total);

      setPage((currentPage) => Math.max(1, Math.min(currentPage, maxPage)));
    },
    [totalPages],
  );
  const setClampedPage = useCallback((nextPage: number) => {
    setPage(Math.max(1, nextPage));
  }, []);
  const setSort = useCallback((nextSort: SortState<ReportSortKey>) => {
    setSortState(nextSort);
    setPage(1);
  }, []);

  return useMemo(
    () => ({
      page,
      sort,
      clampPage,
      setPage: setClampedPage,
      setSort,
    }),
    [clampPage, page, setClampedPage, setSort, sort],
  );
}

function getReportQueryParams(
  userId: string | undefined,
  filters: ReportFilterValues,
  request: ReportRequestState,
): ReportQueryParams {
  return {
    ...filters,
    userId,
    limit: reportsPageSize,
    offset: (request.page - 1) * reportsPageSize,
    sortBy: request.sort?.key,
    sortDirection: request.sort?.direction,
  };
}

function getTotalPages(page: ReportPage<unknown>) {
  return Math.max(1, Math.ceil(page.total / reportsPageSize));
}
