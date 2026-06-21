import type {
  ClientActivityReportRow,
  DealsStageReportRow,
  NewClientReportRow,
  OverdueTaskReportRow,
  SalesReportRow,
} from '../../types/reports';
import type { DealStatus } from '../../types/deal';
import type { TaskStatus } from '../../types/task';
import {
  dealStatusLabels,
  formatCurrency,
  formatDate,
} from '../../utils/formatters';
import classes from '../../pages/ReportsPage.module.css';
import type { ReportColumn, ReportTableRow } from './reportTypes';

export const salesReportColumns: ReportColumn[] = [
  { key: 'id', label: 'ID сделки' },
  { key: 'title', label: 'Название' },
  { key: 'client', label: 'Клиент' },
  { key: 'amount', label: 'Сумма' },
  { key: 'completedAt', label: 'Дата завершения' },
];

export const stageReportColumns: ReportColumn[] = [
  { key: 'stage', label: 'Этап сделки' },
  { key: 'count', label: 'Количество сделок на этапе' },
  { key: 'amount', label: 'Общая сумма сделок на этапе' },
];

export const newClientReportColumns: ReportColumn[] = [
  { key: 'id', label: 'ID клиента' },
  { key: 'name', label: 'Имя клиента' },
  { key: 'company', label: 'Компания' },
  { key: 'createdAt', label: 'Дата добавления' },
];

export const clientActivityReportColumns: ReportColumn[] = [
  { key: 'id', label: 'ID клиента' },
  { key: 'name', label: 'Имя клиента' },
  { key: 'deals', label: 'Количество сделок' },
  { key: 'tasks', label: 'Завершённые задачи' },
];

export const overdueTaskReportColumns: ReportColumn[] = [
  { key: 'id', label: 'ID задачи' },
  { key: 'title', label: 'Название задачи' },
  { key: 'assignee', label: 'Ответственный' },
  { key: 'status', label: 'Статус' },
  { key: 'dueDate', label: 'Дата срока выполнения' },
];

const statusToneByDealStatus: Record<DealStatus, string> = {
  new: '',
  in_progress: classes.statusBlue,
  completed: classes.statusSuccess,
  cancelled: classes.statusWarning,
};

const statusToneByTaskStatus: Record<TaskStatus, string> = {
  new: classes.statusError,
  in_progress: classes.statusError,
  completed: classes.statusError,
};

export function toSalesReportTableRows(
  rows: SalesReportRow[],
): ReportTableRow[] {
  return rows.map((row) => ({
    cells: [
      row.dealId,
      row.title,
      row.clientName,
      formatCurrency(row.amount),
      formatDate(row.completedAt),
    ],
  }));
}

export function toStageReportTableRows(
  rows: DealsStageReportRow[],
): ReportTableRow[] {
  return rows.map((row) => {
    const stage = row.stage;

    return {
      cells: [
        <span className={statusToneByDealStatus[stage]} key={stage}>
          {dealStatusLabels[stage]}
        </span>,
        row.dealsCount,
        formatCurrency(row.totalAmount),
      ],
    };
  });
}

export function toNewClientReportTableRows(
  rows: NewClientReportRow[],
): ReportTableRow[] {
  return rows.map((row) => ({
    cells: [
      row.clientId,
      row.clientName,
      row.company,
      formatDate(row.createdAt),
    ],
  }));
}

export function toClientActivityReportTableRows(
  rows: ClientActivityReportRow[],
): ReportTableRow[] {
  return rows.map((row) => ({
    cells: [row.clientId, row.clientName, row.dealsCount, row.completedTasks],
  }));
}

export function toOverdueTaskReportTableRows(
  rows: OverdueTaskReportRow[],
): ReportTableRow[] {
  return rows.map((row) => ({
    cells: [
      row.taskId,
      row.title,
      row.assigneeName,
      <span className={statusToneByTaskStatus[row.status]} key={row.taskId}>
        Просрочена
      </span>,
      formatDate(row.dueDate),
    ],
  }));
}
