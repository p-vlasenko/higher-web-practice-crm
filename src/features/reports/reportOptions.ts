import { reportPeriods, type ReportFilterValues } from './reportSchemas';
import type { ReportTab } from './reportTypes';

const periodLabels: Record<ReportFilterValues['period'], string> = {
  week: 'За неделю',
  month: 'За месяц',
  quarter: 'За квартал',
};

export const periodOptions = reportPeriods.map((value) => ({
  value,
  label: periodLabels[value],
}));

export const reportTabs: {
  value: ReportTab;
  label: string;
  mobileLabel: string;
}[] = [
  { value: 'sales', label: 'Отчёты по продажам', mobileLabel: 'По продажам' },
  { value: 'clients', label: 'Отчёты по клиентам', mobileLabel: 'По клиентам' },
  { value: 'tasks', label: 'Отчёты по задачам', mobileLabel: 'По задачам' },
];
