import type {
  ClientActivityReportRow,
  DealsStageReportRow,
  NewClientReportRow,
  OverdueTaskReportRow,
  SalesReportRow,
} from '../../types/reports';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { getDealStatusTone } from '../../components/ui/statusTones';
import {
  dealStatusLabels,
  formatCurrency,
  formatDate,
} from '../../utils/formatters';
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
        <StatusBadge key={stage} tone={getDealStatusTone(stage)}>
          {dealStatusLabels[stage]}
        </StatusBadge>,
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
      <StatusBadge key={row.taskId} tone='danger'>
        Просрочена
      </StatusBadge>,
      formatDate(row.dueDate),
    ],
  }));
}
