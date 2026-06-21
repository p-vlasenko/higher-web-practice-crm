import {
  PagedEntityTable,
  type PagedEntityColumn,
} from '../../components/table/PagedEntityTable';
import type { DealSortKey, DealStatus } from '../../types/deal';
import {
  dealStatusLabels,
  formatCurrency,
  formatDate,
} from '../../utils/formatters';
import type { DealTableRow } from '../../utils/relationReadModels';
import type { SortState } from '../../utils/sorting';
import classes from './DealsTable.module.css';

type DealsTableProps = {
  deals: DealTableRow[];
  currentPage: number;
  disabledCreate?: boolean;
  search: string;
  sort: SortState<DealSortKey> | null;
  totalPages: number;
  unfilteredTotal: number;
  onCreate: () => void;
  onPageChange: (page: number) => void;
  onSearchChange: (search: string) => void;
  onSortChange: (sort: SortState<DealSortKey> | null) => void;
  onRowClick: (deal: DealTableRow) => void;
};

const rowClassByStatus: Record<DealStatus, string> = {
  new: classes.rowNew,
  in_progress: classes.rowInProgress,
  completed: classes.rowCompleted,
  cancelled: classes.rowCancelled,
};

const statusClassByStatus: Record<DealStatus, string> = {
  new: classes.statusNew,
  in_progress: classes.statusInProgress,
  completed: classes.statusCompleted,
  cancelled: classes.statusCancelled,
};

const mobileCardClassByStatus: Record<DealStatus, string> = {
  new: classes.mobileCardNew,
  in_progress: classes.mobileCardInProgress,
  completed: classes.mobileCardCompleted,
  cancelled: classes.mobileCardCancelled,
};

function createDealColumns(): PagedEntityColumn<DealTableRow, DealSortKey>[] {
  return [
    {
      key: 'title',
      label: 'Название',
      cellClassName: classes.titleCell,
      render: (deal) => deal.title,
    },
    {
      key: 'client',
      label: 'Клиент',
      cellClassName: classes.clientCell,
      render: (deal) => deal.clientName,
    },
    {
      key: 'description',
      label: 'Описание',
      cellClassName: classes.descriptionCell,
      render: (deal) => deal.description,
    },
    {
      key: 'status',
      label: 'Этап (статус)',
      cellClassName: classes.statusCell,
      render: (deal) => (
        <span className={statusClassByStatus[deal.status]}>
          {dealStatusLabels[deal.status]}
        </span>
      ),
    },
    {
      key: 'amount',
      label: 'Сумма',
      cellClassName: classes.amountCell,
      render: (deal) => formatCurrency(deal.amount),
    },
    {
      key: 'createdAt',
      label: 'Дата создания',
      cellClassName: classes.dateCell,
      render: (deal) => formatDate(deal.createdAt),
    },
    {
      key: 'completedAt',
      label: 'Дата завершения',
      cellClassName: classes.dateCell,
      render: (deal) => formatDate(deal.completedAt),
    },
  ];
}

export function DealsTable({
  deals,
  currentPage,
  disabledCreate = false,
  search,
  sort,
  totalPages,
  unfilteredTotal,
  onCreate,
  onPageChange,
  onSearchChange,
  onSortChange,
  onRowClick,
}: DealsTableProps) {
  return (
    <PagedEntityTable
      classNames={classes}
      columns={createDealColumns()}
      createButtonClassName={classes.newDealButton}
      createLabel='Новая сделка'
      currentPage={currentPage}
      disabledCreate={disabledCreate}
      emptyText='Сделок пока нет'
      filteredEmptyText='Сделки не найдены'
      getItemKey={(deal) => deal.id}
      items={deals}
      mobileCardClassName={(deal) =>
        `${classes.mobileCard} ${mobileCardClassByStatus[deal.status]}`
      }
      mobileCreateButtonClassName={classes.mobileNewDealButton}
      renderMobileCard={renderMobileDealCard}
      rowClassName={(deal) => `${classes.row} ${rowClassByStatus[deal.status]}`}
      search={search}
      searchAriaLabel='Искать сделки'
      sort={sort}
      totalPages={totalPages}
      unfilteredTotal={unfilteredTotal}
      onCreate={onCreate}
      onPageChange={onPageChange}
      onRowClick={onRowClick}
      onSearchChange={onSearchChange}
      onSortChange={onSortChange}
    />
  );
}

function renderMobileDealCard(deal: DealTableRow) {
  return (
    <>
      <span className={classes.mobileCardHeader}>
        <span className={classes.mobileTitle}>{deal.title}</span>
        <span
          className={`${classes.mobileStatus} ${statusClassByStatus[deal.status]}`}
        >
          {dealStatusLabels[deal.status]}
        </span>
      </span>
      <span className={classes.mobileMetaRow}>
        <span className={classes.mobileClient}>{deal.clientName}</span>
        <span className={classes.mobileAmount}>
          {formatCurrency(deal.amount)}
        </span>
      </span>
      <span className={classes.mobileDescription}>{deal.description}</span>
      <span className={classes.mobileDatesRow}>
        <span className={classes.mobileDateGroup}>
          <span>Создана</span>
          <span>{formatDate(deal.createdAt)}</span>
        </span>
        <span className={classes.mobileDateGroup}>
          <span>Завершена</span>
          <span>{formatDate(deal.completedAt)}</span>
        </span>
      </span>
    </>
  );
}
