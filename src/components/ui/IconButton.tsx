import { ActionIcon } from '@mantine/core';
import { cx } from 'classix';
import type { ReactNode } from 'react';

import classes from './ui.module.css';

type CrmIconButtonProps = {
  label: string;
  active?: boolean;
  children: ReactNode;
  onClick?: () => void;
};

export function CrmIconButton({
  label,
  active,
  children,
  onClick,
}: CrmIconButtonProps) {
  return (
    <ActionIcon
      aria-label={label}
      className={cx(classes.iconButton, active && classes.iconButtonActive)}
      onClick={onClick}
      variant='subtle'
    >
      {children}
    </ActionIcon>
  );
}
