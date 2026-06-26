import type { DealStatus } from './deal';
import type { TaskStatus } from './task';
import type { Page, QueryParams } from '../api/query';
import type { ReportFilterValues } from '../features/reports/reportSchemas';

export type ReportSortKey =
  | 'id'
  | 'title'
  | 'client'
  | 'amount'
  | 'completedAt'
  | 'stage'
  | 'count'
  | 'name'
  | 'company'
  | 'createdAt'
  | 'deals'
  | 'tasks'
  | 'assignee'
  | 'status'
  | 'dueDate';

export type SalesReportRow = {
  dealId: string;
  title: string;
  clientName: string;
  amount: number;
  completedAt: string;
};

export type DealsStageReportRow = {
  stage: DealStatus;
  dealsCount: number;
  totalAmount: number;
};

export type NewClientReportRow = {
  clientId: string;
  clientName: string;
  company: string;
  createdAt: string;
};

export type ClientActivityReportRow = {
  clientId: string;
  clientName: string;
  dealsCount: number;
  completedTasks: number;
};

export type OverdueTaskReportRow = {
  taskId: string;
  title: string;
  assigneeName: string;
  dueDate: string;
  status: TaskStatus;
};

export type ReportQueryParams = QueryParams<ReportSortKey> &
  ReportFilterValues & {
    userId?: string;
  };

export type ReportPage<Row> = Page<Row>;
