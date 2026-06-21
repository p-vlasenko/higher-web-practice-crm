import { Select } from '@mantine/core';
import type { ReactNode } from 'react';

import DownIcon from '../../assets/icons/icons-16x16/down.svg?react';
import { Pagination } from '../../components/ui/Pagination';
import type { ReportPeriod } from '../../types/reports';
import classes from '../../pages/ReportsPage.module.css';
import { periodOptions } from './reportOptions';

type ReportSectionProps = {
  title: string;
  children: ReactNode;
  currentPage: number;
  period: ReportPeriod;
  totalPages: number;
  onPageChange: (page: number) => void;
  onPeriodChange: (period: ReportPeriod) => void;
};

export function ReportSection({
  title,
  children,
  currentPage,
  period,
  totalPages,
  onPageChange,
  onPeriodChange,
}: ReportSectionProps) {
  return (
    <section className={classes.reportSection}>
      <h2 className={classes.reportTitle}>{title}</h2>
      <ReportToolbar period={period} onPeriodChange={onPeriodChange} />
      {children}
      <Pagination
        currentPage={currentPage}
        showJump={false}
        totalPages={totalPages}
        onPageChange={onPageChange}
      />
    </section>
  );
}

function ReportToolbar({
  period,
  onPeriodChange,
}: {
  period: ReportPeriod;
  onPeriodChange: (period: ReportPeriod) => void;
}) {
  return (
    <div className={classes.reportToolbar}>
      <Select
        allowDeselect={false}
        classNames={{
          root: classes.periodSelectRoot,
          input: classes.selectInput,
          section: classes.selectSection,
        }}
        data={periodOptions}
        value={period}
        rightSection={<DownIcon aria-hidden='true' />}
        onChange={(value) => {
          if (value) onPeriodChange(value as ReportPeriod);
        }}
      />
    </div>
  );
}
