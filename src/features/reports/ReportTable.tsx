import { cx } from 'classix';

import DownIcon from '../../../design/ui-kit/icons-16x16/down.svg?react';
import classes from '../../pages/ReportsPage.module.css';
import type { ReportSortKey } from '../../types/reports';
import { toggleSort, type SortState } from '../../utils/sorting';
import { MobileReportCard } from './MobileReportCard';
import type {
  ReportCardVariant,
  ReportColumn,
  ReportTableRow,
} from './reportTypes';

type ReportTableProps = {
  columns: ReportColumn[];
  danger?: boolean;
  variant: ReportCardVariant;
  rows: ReportTableRow[];
  sort: SortState<ReportSortKey> | null;
  onSortChange: (sort: SortState<ReportSortKey>) => void;
};

export function ReportTable({
  columns,
  danger = false,
  variant,
  rows,
  sort,
  onSortChange,
}: ReportTableProps) {
  const columnsClass = getReportColumnsClass(columns);

  return (
    <div className={classes.reportTable}>
      <div className={cx(classes.reportHeaderRow, columnsClass)}>
        {columns.map((column) => (
          <button
            className={cx(
              classes.reportHeaderCell,
              sort?.key === column.key && classes.reportHeaderCellActive,
            )}
            key={column.key}
            type='button'
            onClick={() => onSortChange(toggleSort(sort, column.key))}
          >
            {column.label}
            <DownIcon
              aria-hidden='true'
              className={cx(
                sort?.key === column.key &&
                  sort.direction === 'asc' &&
                  classes.sortIconAsc,
              )}
            />
          </button>
        ))}
      </div>
      <div className={classes.reportRows}>
        {rows.length ? (
          rows.map((row, index) => (
            <div
              className={cx(
                classes.reportRow,
                columnsClass,
                danger && classes.reportRowDanger,
              )}
              key={index}
            >
              {row.cells.map((cell, cellIndex) => (
                <span className={classes.reportDesktopCell} key={cellIndex}>
                  {cell}
                </span>
              ))}
              <MobileReportCard row={row} variant={variant} />
            </div>
          ))
        ) : (
          <p className={classes.reportEmpty}>Нет данных для отображения.</p>
        )}
      </div>
    </div>
  );
}

function getReportColumnsClass(columns: ReportColumn[]) {
  const hasIdColumn = columns[0]?.key === 'id';

  if (columns.length === 3) {
    return classes.reportColumnsThree;
  }

  if (columns.length === 4) {
    return hasIdColumn
      ? classes.reportColumnsFourWithId
      : classes.reportColumnsFour;
  }

  return hasIdColumn
    ? classes.reportColumnsFiveWithId
    : classes.reportColumnsFive;
}
