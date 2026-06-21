import { Button } from '@mantine/core';
import type { ReactNode } from 'react';

import classes from '../../pages/Page.module.css';

type DashboardSectionProps = {
  title: string;
  buttonLabel: string;
  children: ReactNode;
  disabled?: boolean;
  onAction: () => void;
};

export function DashboardSection({
  title,
  buttonLabel,
  children,
  disabled = false,
  onAction,
}: DashboardSectionProps) {
  return (
    <section className={classes.dashboardSection}>
      <h2 className={classes.dashboardSectionTitle}>{title}</h2>
      <div className={classes.dashboardSectionContent}>{children}</div>
      <Button
        className={classes.dashboardButton}
        disabled={disabled}
        onClick={onAction}
      >
        {buttonLabel}
      </Button>
    </section>
  );
}

export function MobileDashboardSection({
  title,
  buttonLabel,
  children,
  disabled = false,
  onAction,
}: DashboardSectionProps) {
  return (
    <section className={classes.mobileDashboardSection}>
      <h2 className={classes.dashboardSectionTitle}>{title}</h2>
      {children}
      <Button
        className={classes.mobileDashboardButton}
        disabled={disabled}
        onClick={onAction}
      >
        {buttonLabel}
      </Button>
    </section>
  );
}
