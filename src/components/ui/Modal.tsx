import { Button, Modal as MantineModal } from '@mantine/core';
import { cx } from 'classix';
import type { ReactNode } from 'react';

import ArrowIcon from '../../assets/ui-kit/icons-16x16/arrow.svg?react';
import classes from './ui.module.css';

type CrmModalProps = {
  opened: boolean;
  title: string;
  children: ReactNode;
  actions?: ReactNode;
  headerMeta?: ReactNode;
  hideCancelOnMobile?: boolean;
  loading?: boolean;
  mobileBackLabel?: string;
  submitLabel?: string;
  onClose: () => void;
  onSubmit?: () => void;
};

export function CrmModal({
  opened,
  title,
  children,
  actions,
  headerMeta,
  hideCancelOnMobile = false,
  loading,
  mobileBackLabel,
  submitLabel = 'Сохранить',
  onClose,
  onSubmit,
}: CrmModalProps) {
  const contentClassName = cx(
    classes.modalContent,
    mobileBackLabel && classes.modalContentWithMobileHeader,
  );

  return (
    <MantineModal
      centered
      opened={opened}
      padding={24}
      size={612}
      title={title}
      withCloseButton={false}
      classNames={{
        body: classes.modalBody,
        content: contentClassName,
        header: classes.modalHeader,
        title: classes.modalTitle,
      }}
      onClose={onClose}
    >
      {mobileBackLabel ? (
        <button
          className={classes.mobileModalBackButton}
          type='button'
          onClick={onClose}
        >
          <ArrowIcon aria-hidden='true' />
          <span>{mobileBackLabel}</span>
        </button>
      ) : null}
      {headerMeta ? (
        <div className={classes.modalHeaderMeta}>{headerMeta}</div>
      ) : null}
      {children}
      {actions ??
        (onSubmit ? (
          <div
            className={cx(
              classes.actions,
              hideCancelOnMobile && classes.mobileSingleAction,
            )}
          >
            <Button
              className={classes.primaryAction}
              loading={loading}
              onClick={onSubmit}
            >
              {submitLabel}
            </Button>
            <Button
              className={classes.secondaryAction}
              variant='default'
              onClick={onClose}
            >
              Отменить
            </Button>
          </div>
        ) : null)}
    </MantineModal>
  );
}
