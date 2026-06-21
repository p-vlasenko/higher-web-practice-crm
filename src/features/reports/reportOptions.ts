import type { ReportPeriod } from '../../types/reports';
import type { ReportTab } from './reportTypes';

export const periodOptions: { value: ReportPeriod; label: string }[] = [
  { value: 'week', label: 'За неделю' },
  { value: 'month', label: 'За месяц' },
  { value: 'quarter', label: 'За квартал' },
];

export const reportTabs: {
  value: ReportTab;
  label: string;
  mobileLabel: string;
}[] = [
  { value: 'sales', label: 'Отчёты по продажам', mobileLabel: 'По продажам' },
  { value: 'clients', label: 'Отчёты по клиентам', mobileLabel: 'По клиентам' },
  { value: 'tasks', label: 'Отчёты по задачам', mobileLabel: 'По задачам' },
];
