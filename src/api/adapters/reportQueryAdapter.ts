import type { Client } from '../../types/client';
import type { Deal } from '../../types/deal';
import type {
  ClientActivityReportRow,
  DealsStageReportRow,
  NewClientReportRow,
  OverdueTaskReportRow,
  ReportPage,
  ReportQueryParams,
  ReportSortKey,
  SalesReportRow,
} from '../../types/reports';
import type { Task } from '../../types/task';
import type { User } from '../../types/user';
import type { SortValue } from '../../utils/sorting';
import {
  getReportFilterRange,
  parseReportFilters,
} from '../../features/reports/reportFilters';
import type { ReportFilterValues } from '../../features/reports/reportSchemas';
import { applySort, paginateItems } from '../query';
import {
  buildClientActivityRows,
  buildNewClientRows,
  buildOverdueTaskRows,
  buildSalesRows,
  buildStageRows,
} from './reportBuilders';
import type {
  AdapterBaseQuery,
  AdapterBaseQueryResult,
} from './baseQueryAdapter';

type ReportSourceData = {
  clients: Client[];
  deals: Deal[];
  tasks: Task[];
  users: User[];
};

const reportPageSizeFallback = 10;

async function loadReportSources(
  baseQuery: AdapterBaseQuery,
  userId?: string,
): Promise<
  | { data: ReportSourceData }
  | { error: NonNullable<AdapterBaseQueryResult['error']> }
> {
  const ownerParams = userId ? { createdBy: userId } : undefined;
  const [clientsResult, dealsResult, tasksResult, usersResult] =
    await Promise.all([
      baseQuery({ url: '/clients', params: ownerParams }),
      baseQuery({ url: '/deals', params: ownerParams }),
      baseQuery({ url: '/tasks', params: ownerParams }),
      baseQuery({ url: '/users' }),
    ]);

  if (clientsResult.error) return { error: clientsResult.error };
  if (dealsResult.error) return { error: dealsResult.error };
  if (tasksResult.error) return { error: tasksResult.error };
  if (usersResult.error) return { error: usersResult.error };

  return {
    data: {
      clients: clientsResult.data as Client[],
      deals: dealsResult.data as Deal[],
      tasks: tasksResult.data as Task[],
      users: usersResult.data as User[],
    },
  };
}

function getReportRange(params: ReportQueryParams) {
  return getReportFilterRange(parseReportFilters(params));
}

function getFilteredSources(
  sources: ReportSourceData,
  filters: ReportFilterValues,
) {
  const deals = sources.deals.filter((deal) => {
    if (filters.managerId && deal.createdBy !== filters.managerId) {
      return false;
    }

    return !filters.dealStatus || deal.status === filters.dealStatus;
  });
  const clients = sources.clients.filter(
    (client) => !filters.managerId || client.createdBy === filters.managerId,
  );
  const tasks = sources.tasks.filter((task) => {
    if (
      filters.managerId &&
      task.createdBy !== filters.managerId &&
      task.assigneeId !== filters.managerId
    ) {
      return false;
    }

    if (!filters.dealStatus) return true;

    return deals.some((deal) => deal.id === task.dealId);
  });

  return { ...sources, clients, deals, tasks };
}

function buildReportPage<T>(
  rows: T[],
  params: ReportQueryParams,
  getValue: (row: T, key: ReportSortKey) => SortValue,
): ReportPage<T> {
  const sortedRows = applySort(rows, params, getValue);

  return paginateItems(sortedRows, {
    limit: params.limit ?? reportPageSizeFallback,
    offset: params.offset,
  });
}

function getSalesSortValue(row: SalesReportRow, key: ReportSortKey): SortValue {
  switch (key) {
    case 'id':
      return row.dealId;
    case 'title':
      return row.title;
    case 'client':
      return row.clientName;
    case 'amount':
      return row.amount;
    case 'completedAt':
      return row.completedAt;
    default:
      return undefined;
  }
}

function getStageSortValue(
  row: DealsStageReportRow,
  key: ReportSortKey,
): SortValue {
  switch (key) {
    case 'stage':
      return row.stage;
    case 'count':
      return row.dealsCount;
    case 'amount':
      return row.totalAmount;
    default:
      return undefined;
  }
}

function getNewClientSortValue(
  row: NewClientReportRow,
  key: ReportSortKey,
): SortValue {
  switch (key) {
    case 'id':
      return row.clientId;
    case 'name':
      return row.clientName;
    case 'company':
      return row.company;
    case 'createdAt':
      return row.createdAt;
    default:
      return undefined;
  }
}

function getClientActivitySortValue(
  row: ClientActivityReportRow,
  key: ReportSortKey,
): SortValue {
  switch (key) {
    case 'id':
      return row.clientId;
    case 'name':
      return row.clientName;
    case 'deals':
      return row.dealsCount;
    case 'tasks':
      return row.completedTasks;
    default:
      return undefined;
  }
}

function getOverdueTaskSortValue(
  row: OverdueTaskReportRow,
  key: ReportSortKey,
): SortValue {
  switch (key) {
    case 'id':
      return row.taskId;
    case 'title':
      return row.title;
    case 'assignee':
      return row.assigneeName;
    case 'status':
      return 'Просрочена';
    case 'dueDate':
      return row.dueDate;
    default:
      return undefined;
  }
}

export async function getSalesReportPage(
  params: ReportQueryParams,
  baseQuery: AdapterBaseQuery,
) {
  const sources = await loadReportSources(baseQuery, params.userId);
  if ('error' in sources) return { error: sources.error };

  const filters = parseReportFilters(params);
  const filteredSources = getFilteredSources(sources.data, filters);
  const { dateFrom, dateTo } = getReportRange(params);

  return {
    data: buildReportPage(
      buildSalesRows(
        filteredSources.deals,
        filteredSources.clients,
        dateFrom,
        dateTo,
      ),
      params,
      getSalesSortValue,
    ),
  };
}

export async function getStageReportPage(
  params: ReportQueryParams,
  baseQuery: AdapterBaseQuery,
) {
  const sources = await loadReportSources(baseQuery, params.userId);
  if ('error' in sources) return { error: sources.error };

  const filters = parseReportFilters(params);
  const filteredSources = getFilteredSources(sources.data, filters);
  const { dateFrom, dateTo } = getReportRange(params);

  return {
    data: buildReportPage(
      buildStageRows(filteredSources.deals, dateFrom, dateTo).filter(
        (row) => row.dealsCount > 0,
      ),
      params,
      getStageSortValue,
    ),
  };
}

export async function getNewClientsReportPage(
  params: ReportQueryParams,
  baseQuery: AdapterBaseQuery,
) {
  const sources = await loadReportSources(baseQuery, params.userId);
  if ('error' in sources) return { error: sources.error };

  const filters = parseReportFilters(params);
  const filteredSources = getFilteredSources(sources.data, filters);
  const { dateFrom, dateTo } = getReportRange(params);

  return {
    data: buildReportPage(
      buildNewClientRows(filteredSources.clients, dateFrom, dateTo),
      params,
      getNewClientSortValue,
    ),
  };
}

export async function getClientActivityReportPage(
  params: ReportQueryParams,
  baseQuery: AdapterBaseQuery,
) {
  const sources = await loadReportSources(baseQuery, params.userId);
  if ('error' in sources) return { error: sources.error };

  const filters = parseReportFilters(params);
  const filteredSources = getFilteredSources(sources.data, filters);
  const { dateFrom, dateTo } = getReportRange(params);

  return {
    data: buildReportPage(
      buildClientActivityRows(
        filteredSources.clients,
        filteredSources.deals,
        filteredSources.tasks,
        dateFrom,
        dateTo,
      ),
      params,
      getClientActivitySortValue,
    ),
  };
}

export async function getOverdueTasksReportPage(
  params: ReportQueryParams,
  baseQuery: AdapterBaseQuery,
) {
  const sources = await loadReportSources(baseQuery, params.userId);
  if ('error' in sources) return { error: sources.error };

  const filters = parseReportFilters(params);
  const filteredSources = getFilteredSources(sources.data, filters);
  const { dateFrom, dateTo, now } = getReportRange(params);

  return {
    data: buildReportPage(
      buildOverdueTaskRows(
        filteredSources.tasks,
        filteredSources.users,
        now,
        dateFrom,
        dateTo,
      ),
      params,
      getOverdueTaskSortValue,
    ),
  };
}
