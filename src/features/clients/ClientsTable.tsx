import {
  PagedEntityTable,
  type PagedEntityColumn,
} from '../../components/table/PagedEntityTable';
import { cx } from 'classix';
import type { Client, ClientSortKey } from '../../types/client';
import { formatDate, formatPhone } from '../../utils/formatters';
import type { SortState } from '../../utils/sorting';
import classes from './ClientsTable.module.css';

type ClientsTableProps = {
  clients: Client[];
  currentPage: number;
  search: string;
  sort: SortState<ClientSortKey> | null;
  totalPages: number;
  unfilteredTotal: number;
  onCreate: () => void;
  onPageChange: (page: number) => void;
  onSearchChange: (search: string) => void;
  onSortChange: (sort: SortState<ClientSortKey> | null) => void;
  onRowClick: (client: Client) => void;
};

const columns: PagedEntityColumn<Client, ClientSortKey>[] = [
  {
    key: 'name',
    label: 'Имя',
    cellClassName: classes.nameCell,
    render: (client) => client.name,
  },
  {
    key: 'phone',
    label: 'Телефон',
    render: (client) => formatPhone(client.phone),
  },
  {
    key: 'email',
    label: 'Email',
    cellClassName: classes.linkCell,
    render: (client) => client.email,
  },
  {
    key: 'company',
    label: 'Название компании',
    render: (client) => client.company,
  },
  { key: 'website', label: 'Сайт', render: (client) => client.website },
  {
    key: 'comment',
    label: 'Комментарий',
    cellClassName: classes.commentCell,
    render: (client) => client.comment,
  },
  {
    key: 'createdAt',
    label: 'Добавлен',
    render: (client) => formatDate(client.createdAt),
  },
];

export function ClientsTable({
  clients,
  currentPage,
  search,
  sort,
  totalPages,
  unfilteredTotal,
  onCreate,
  onPageChange,
  onSearchChange,
  onSortChange,
  onRowClick,
}: ClientsTableProps) {
  return (
    <PagedEntityTable
      classNames={classes}
      columns={columns}
      createButtonClassName={classes.newClientButton}
      createLabel='Новый клиент'
      currentPage={currentPage}
      emptyText='Клиентов пока нет'
      filteredEmptyText='Клиенты не найдены'
      getItemKey={(client) => client.id}
      items={clients}
      mobileCardClassName={(client) =>
        cx(classes.mobileCard, client.deleted && classes.mobileCardDeleted)
      }
      mobileCreateButtonClassName={classes.mobileNewClientButton}
      renderMobileCard={renderMobileClientCard}
      rowClassName={(client) =>
        cx(classes.row, client.deleted && classes.rowDeleted)
      }
      search={search}
      searchAriaLabel='Искать клиентов'
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

function renderMobileClientCard(client: Client) {
  return (
    <>
      <span className={classes.mobileCardHeader}>
        <span className={classes.mobileClientName}>{client.name}</span>
        <span className={classes.mobileClientDate}>
          {formatDate(client.createdAt)}
        </span>
      </span>
      <span className={classes.mobileContactBlock}>
        <span className={classes.mobileContactRow}>
          <span>{formatPhone(client.phone)}</span>
          <span>{client.company}</span>
        </span>
        <span className={classes.mobileContactRow}>
          <span className={classes.mobileEmail}>{client.email}</span>
          <span>{client.website}</span>
        </span>
      </span>
      <span className={classes.mobileClientNote}>{client.comment}</span>
    </>
  );
}
