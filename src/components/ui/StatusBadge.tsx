import { cx } from 'classix';
import type { ReactNode } from 'react';

import classes from './StatusBadge.module.css';
import type { StatusTone } from './statusTones';

type StatusBadgeProps = {
  children: ReactNode;
  tone: StatusTone;
  className?: string;
};

const classByTone: Record<StatusTone, string> = {
  new: classes.statusNew,
  inProgress: classes.statusInProgress,
  completed: classes.statusCompleted,
  cancelled: classes.statusCancelled,
  danger: classes.statusDanger,
};

export function StatusBadge({ children, className, tone }: StatusBadgeProps) {
  return (
    <span className={cx(classes.statusBadge, classByTone[tone], className)}>
      {children}
    </span>
  );
}
