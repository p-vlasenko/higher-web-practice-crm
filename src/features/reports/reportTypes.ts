import type { ReactNode } from 'react';

import type { ReportSortKey } from '../../types/reports';

export type ReportTab = 'sales' | 'clients' | 'tasks';

export type ReportCardVariant =
  | 'salesSummary'
  | 'dealStages'
  | 'newClients'
  | 'clientActivity'
  | 'overdueTasks';

export type ReportColumn = {
  key: ReportSortKey;
  label: string;
};

export type ReportTableRow = {
  cells: ReactNode[];
};
