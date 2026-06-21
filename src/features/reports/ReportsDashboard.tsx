import { useCallback, useEffect, useMemo, useState } from 'react';

import {
  useGetClientActivityReportQuery,
  useGetNewClientsReportQuery,
  useGetOverdueTasksReportQuery,
  useGetSalesReportQuery,
  useGetStageReportQuery,
} from '../../api/endpoints/crmEndpoints';
import type {
  ReportPage,
  ReportPeriod,
  ReportQueryParams,
  ReportSortKey,
} from '../../types/reports';
import type { SortState } from '../../utils/sorting';
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
  const activeReports = reportsConfig.filter(
    (report) => report.tab === activeTab,
  );

  return (
    <>
      <ReportTabs activeTab={activeTab} onTabChange={setActiveTab} />

      {activeReports.map((report) => (
        <ReportConfigSection
          config={report}
          key={report.id}
          request={reportRequests[report.id]}
          userId={userId}
        />
      ))}
    </>
  );
}

function useReportRequests(): Record<ReportId, ReportRequestState> {
  const sales = useReportRequestState();
  const stages = useReportRequestState();
  const newClients = useReportRequestState();
  const clientActivity = useReportRequestState();
  const overdueTasks = useReportRequestState();

  return useMemo(
    () => ({
      sales,
      stages,
      newClients,
      clientActivity,
      overdueTasks,
    }),
    [clientActivity, newClients, overdueTasks, sales, stages],
  );
}

type ReportConfigSectionProps = {
  config: NormalizedReportConfig;
  request: ReportRequestState;
  userId?: string;
};

function ReportConfigSection({
  config,
  request,
  userId,
}: ReportConfigSectionProps) {
  const { data = emptyReportPage } = config.queryHook(
    getReportQueryParams(userId, request),
  );

  useEffect(() => {
    request.clampPage(data.total);
  }, [data.total, request]);

  return (
    <ReportSection
      title={config.title}
      currentPage={request.page}
      period={request.period}
      totalPages={getTotalPages(data)}
      onPageChange={request.setPage}
      onPeriodChange={request.setPeriod}
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
  period: ReportPeriod;
  sort: SortState<ReportSortKey> | null;
  clampPage: (total: number) => void;
  setPage: (page: number) => void;
  setPeriod: (period: ReportPeriod) => void;
  setSort: (sort: SortState<ReportSortKey>) => void;
};

function useReportRequestState(): ReportRequestState {
  const [page, setPage] = useState(1);
  const [period, setPeriodState] = useState<ReportPeriod>('week');
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
  const setPeriod = useCallback((nextPeriod: ReportPeriod) => {
    setPeriodState(nextPeriod);
    setPage(1);
  }, []);
  const setSort = useCallback((nextSort: SortState<ReportSortKey>) => {
    setSortState(nextSort);
    setPage(1);
  }, []);

  return useMemo(
    () => ({
      page,
      period,
      sort,
      clampPage,
      setPage: setClampedPage,
      setPeriod,
      setSort,
    }),
    [clampPage, page, period, setClampedPage, setPeriod, setSort, sort],
  );
}

function getReportQueryParams(
  userId: string | undefined,
  request: ReportRequestState,
) {
  return {
    userId,
    period: request.period,
    limit: reportsPageSize,
    offset: (request.page - 1) * reportsPageSize,
    sortBy: request.sort?.key,
    sortDirection: request.sort?.direction,
  };
}

function getTotalPages(page: ReportPage<unknown>) {
  return Math.max(1, Math.ceil(page.total / reportsPageSize));
}
