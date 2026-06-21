import type { Deal } from '../../types/deal';
import type { Task, TaskSortKey } from '../../types/task';
import type { User } from '../../types/user';
import { formatDate, taskStatusLabels } from '../../utils/formatters';
import {
  createTaskTableRows,
  type TaskTableRow,
} from '../../utils/relationReadModels';
import { applySort, normalizeSearch, paginateItems, type Page } from '../query';
import type {
  WithPagination,
  WithSearch,
  WithSort,
  WithUser,
} from '../endpoints/endpointTypes';
import type { AdapterBaseQuery } from './baseQueryAdapter';

export type GetTasksParams =
  | (WithUser & WithSearch & WithPagination & WithSort<TaskSortKey>)
  | void;

export type TaskPage = Page<TaskTableRow>;

function matchesTaskSearch(task: TaskTableRow, query: string) {
  return [
    task.title,
    task.dealTitle,
    task.description,
    formatDate(task.dueDate),
    task.assigneeName,
    taskStatusLabels[task.status],
    formatDate(task.createdAt),
  ]
    .filter(Boolean)
    .some((value) => value?.toLowerCase().includes(query));
}

function getTaskSortValue(task: TaskTableRow, sortBy: TaskSortKey) {
  switch (sortBy) {
    case 'title':
      return task.title;
    case 'deal':
      return task.dealTitle;
    case 'description':
      return task.description;
    case 'dueDate':
      return task.dueDate;
    case 'assignee':
      return task.assigneeName;
    case 'status':
      return taskStatusLabels[task.status];
    case 'createdAt':
      return task.createdAt;
    default:
      return undefined;
  }
}

export async function getTasksPage(
  params: GetTasksParams,
  baseQuery: AdapterBaseQuery,
) {
  const ownerParams = params?.userId ? { createdBy: params.userId } : undefined;

  const tasksResult = await baseQuery({
    url: '/tasks',
    params: ownerParams,
  });

  if (tasksResult.error) {
    return { error: tasksResult.error };
  }

  const [dealsResult, usersResult] = await Promise.all([
    baseQuery({ url: '/deals', params: ownerParams }),
    baseQuery({ url: '/users' }),
  ]);

  if (dealsResult.error) {
    return { error: dealsResult.error };
  }

  if (usersResult.error) {
    return { error: usersResult.error };
  }

  const query = normalizeSearch(params?.search);
  let tasks = createTaskTableRows(
    tasksResult.data as Task[],
    dealsResult.data as Deal[],
    usersResult.data as User[],
  );
  const unfilteredTotal = tasks.length;

  if (query) {
    tasks = tasks.filter((task) => matchesTaskSearch(task, query));
  }

  tasks = applySort(tasks, params ?? {}, (task, key) =>
    getTaskSortValue(task, key),
  );

  return {
    data: paginateItems(tasks, params ?? {}, unfilteredTotal),
  };
}
