import type { ReactNode } from 'react';

import { toggleSort, type SortState } from '../../utils/sorting';
import { getPagedEntityEmptyText } from './pagedEntityTableState';
import {
  DesktopRows,
  MobileCards,
  PaginationFooter,
  SortableHeader,
  TableToolbar,
} from './PagedEntityTableParts';

export type PagedEntityColumn<T, SortKey extends string> = {
  key: SortKey;
  label: string;
  render: (item: T) => ReactNode;
  cellClassName?: string;
};

type PagedEntityTableClasses = Record<string, string>;

type PagedEntityTableProps<T, SortKey extends string> = {
  items: T[];
  columns: PagedEntityColumn<T, SortKey>[];
  classNames: PagedEntityTableClasses;
  createButtonClassName: string;
  createLabel: string;
  currentPage: number;
  disabledCreate?: boolean;
  emptyText: string;
  filteredEmptyText: string;
  getItemKey: (item: T) => string;
  mobileCreateButtonClassName: string;
  renderMobileCard: (item: T) => ReactNode;
  search: string;
  searchAriaLabel: string;
  sort: SortState<SortKey> | null;
  totalPages: number;
  unfilteredTotal: number;
  mobileCardClassName?: (item: T, index: number) => string;
  rowClassName?: (item: T, index: number) => string;
  onCreate: () => void;
  onPageChange: (page: number) => void;
  onRowClick: (item: T) => void;
  onSearchChange: (search: string) => void;
  onSortChange: (sort: SortState<SortKey> | null) => void;
};

export function PagedEntityTable<T, SortKey extends string>({
  items,
  columns,
  classNames,
  createButtonClassName,
  createLabel,
  currentPage,
  disabledCreate = false,
  emptyText,
  filteredEmptyText,
  getItemKey,
  mobileCreateButtonClassName,
  renderMobileCard,
  search,
  searchAriaLabel,
  sort,
  totalPages,
  unfilteredTotal,
  mobileCardClassName,
  rowClassName,
  onCreate,
  onPageChange,
  onRowClick,
  onSearchChange,
  onSortChange,
}: PagedEntityTableProps<T, SortKey>) {
  const handleSortChange = (key: SortKey) => {
    onSortChange(toggleSort(sort, key));
    onPageChange(1);
  };
  const emptyStateText = getPagedEntityEmptyText({
    emptyText,
    filteredEmptyText,
    unfilteredTotal,
  });

  return (
    <section className={classNames.root}>
      <TableToolbar
        classNames={classNames}
        createButtonClassName={createButtonClassName}
        createLabel={createLabel}
        disabledCreate={disabledCreate}
        search={search}
        searchAriaLabel={searchAriaLabel}
        onCreate={onCreate}
        onSearchChange={onSearchChange}
      />

      <div className={classNames.table}>
        <SortableHeader
          classNames={classNames}
          columns={columns}
          sort={sort}
          onSortChange={handleSortChange}
        />
        <DesktopRows
          classNames={classNames}
          columns={columns}
          emptyStateText={emptyStateText}
          getItemKey={getItemKey}
          items={items}
          rowClassName={rowClassName}
          onRowClick={onRowClick}
        />
      </div>

      <MobileCards
        classNames={classNames}
        emptyStateText={emptyStateText}
        getItemKey={getItemKey}
        items={items}
        mobileCardClassName={mobileCardClassName}
        renderMobileCard={renderMobileCard}
        onRowClick={onRowClick}
      />

      <PaginationFooter
        createLabel={createLabel}
        currentPage={currentPage}
        disabledCreate={disabledCreate}
        mobileCreateButtonClassName={mobileCreateButtonClassName}
        totalPages={totalPages}
        onCreate={onCreate}
        onPageChange={onPageChange}
      />
    </section>
  );
}
