import { Button, TextInput } from '@mantine/core';
import { cx } from 'classix';
import type { ReactNode } from 'react';

import DownIcon from '../../../design/ui-kit/icons-16x16/down.svg?react';
import type { SortState } from '../../utils/sorting';
import { Pagination } from '../ui/Pagination';
import type { PagedEntityColumn } from './PagedEntityTable';

type PagedEntityTableClasses = Record<string, string>;

type TableToolbarProps = {
  classNames: PagedEntityTableClasses;
  createButtonClassName: string;
  createLabel: string;
  disabledCreate: boolean;
  search: string;
  searchAriaLabel: string;
  onCreate: () => void;
  onSearchChange: (search: string) => void;
};

export function TableToolbar({
  classNames,
  createButtonClassName,
  createLabel,
  disabledCreate,
  search,
  searchAriaLabel,
  onCreate,
  onSearchChange,
}: TableToolbarProps) {
  return (
    <div className={classNames.toolbar}>
      <Button
        className={createButtonClassName}
        disabled={disabledCreate}
        onClick={onCreate}
      >
        {createLabel}
      </Button>
      <TextInput
        aria-label={searchAriaLabel}
        classNames={{
          root: classNames.searchRoot,
          input: classNames.searchInput,
          section: classNames.searchSection,
        }}
        leftSection={
          <span aria-hidden='true' className={classNames.searchIcon} />
        }
        placeholder='Искать'
        value={search}
        onChange={(event) => {
          onSearchChange(event.currentTarget.value);
        }}
      />
    </div>
  );
}

type SortableHeaderProps<T, SortKey extends string> = {
  classNames: PagedEntityTableClasses;
  columns: PagedEntityColumn<T, SortKey>[];
  sort: SortState<SortKey> | null;
  onSortChange: (key: SortKey) => void;
};

export function SortableHeader<T, SortKey extends string>({
  classNames,
  columns,
  sort,
  onSortChange,
}: SortableHeaderProps<T, SortKey>) {
  return (
    <div className={classNames.headerRow}>
      {columns.map((column) => (
        <button
          className={cx(
            classNames.headerCell,
            sort?.key === column.key && classNames.headerCellActive,
          )}
          key={column.key}
          type='button'
          onClick={() => onSortChange(column.key)}
        >
          {column.label}
          <DownIcon
            aria-hidden='true'
            className={cx(
              sort?.key === column.key &&
                sort.direction === 'asc' &&
                classNames.sortIconAsc,
            )}
          />
        </button>
      ))}
    </div>
  );
}

type DesktopRowsProps<T, SortKey extends string> = {
  classNames: PagedEntityTableClasses;
  columns: PagedEntityColumn<T, SortKey>[];
  emptyStateText: string;
  getItemKey: (item: T) => string;
  items: T[];
  rowClassName?: (item: T, index: number) => string;
  onRowClick: (item: T) => void;
};

export function DesktopRows<T, SortKey extends string>({
  classNames,
  columns,
  emptyStateText,
  getItemKey,
  items,
  rowClassName,
  onRowClick,
}: DesktopRowsProps<T, SortKey>) {
  if (!items.length) {
    return <p className={classNames.empty}>{emptyStateText}</p>;
  }

  return (
    <div className={classNames.rows}>
      {items.map((item, index) => (
        <button
          className={rowClassName?.(item, index) ?? classNames.row}
          key={getItemKey(item)}
          type='button'
          onClick={() => onRowClick(item)}
        >
          {columns.map((column) => (
            <span className={column.cellClassName} key={column.key}>
              {column.render(item)}
            </span>
          ))}
        </button>
      ))}
    </div>
  );
}

type MobileCardsProps<T> = {
  classNames: PagedEntityTableClasses;
  emptyStateText: string;
  getItemKey: (item: T) => string;
  items: T[];
  mobileCardClassName?: (item: T, index: number) => string;
  renderMobileCard: (item: T) => ReactNode;
  onRowClick: (item: T) => void;
};

export function MobileCards<T>({
  classNames,
  emptyStateText,
  getItemKey,
  items,
  mobileCardClassName,
  renderMobileCard,
  onRowClick,
}: MobileCardsProps<T>) {
  return (
    <div className={classNames.mobileCardList}>
      {items.length ? (
        items.map((item, index) => (
          <button
            className={mobileCardClassName?.(item, index)}
            key={getItemKey(item)}
            type='button'
            onClick={() => onRowClick(item)}
          >
            {renderMobileCard(item)}
          </button>
        ))
      ) : (
        <p className={classNames.empty}>{emptyStateText}</p>
      )}
    </div>
  );
}

type PaginationFooterProps = {
  createLabel: string;
  currentPage: number;
  disabledCreate: boolean;
  mobileCreateButtonClassName: string;
  totalPages: number;
  onCreate: () => void;
  onPageChange: (page: number) => void;
};

export function PaginationFooter({
  createLabel,
  currentPage,
  disabledCreate,
  mobileCreateButtonClassName,
  totalPages,
  onCreate,
  onPageChange,
}: PaginationFooterProps) {
  return (
    <>
      <Button
        className={mobileCreateButtonClassName}
        disabled={disabledCreate}
        onClick={onCreate}
      >
        {createLabel}
      </Button>
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={onPageChange}
      />
    </>
  );
}
