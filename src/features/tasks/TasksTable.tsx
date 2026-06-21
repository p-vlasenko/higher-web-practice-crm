import {
  PagedEntityTable,
  type PagedEntityColumn,
} from '../../components/table/PagedEntityTable';
import { cx } from 'classix';
import type { TaskSortKey, TaskStatus } from '../../types/task';
import { formatDate, taskStatusLabels } from '../../utils/formatters';
import type { TaskTableRow } from '../../utils/relationReadModels';
import type { SortState } from '../../utils/sorting';
import classes from './TasksTable.module.css';

type TasksTableProps = {
  tasks: TaskTableRow[];
  search: string;
  currentPage: number;
  disabledCreate?: boolean;
  sort: SortState<TaskSortKey> | null;
  totalPages: number;
  unfilteredTotal: number;
  onCreate: () => void;
  onPageChange: (page: number) => void;
  onSearchChange: (search: string) => void;
  onSortChange: (sort: SortState<TaskSortKey> | null) => void;
  onRowClick: (task: TaskTableRow) => void;
};

const statusClassByStatus: Record<TaskStatus, string> = {
  new: classes.statusNew,
  in_progress: classes.statusInProgress,
  completed: classes.statusCompleted,
};

function createTaskColumns(): PagedEntityColumn<TaskTableRow, TaskSortKey>[] {
  return [
    {
      key: 'title',
      label: 'Название',
      cellClassName: classes.titleCell,
      render: (task) => task.title,
    },
    {
      key: 'deal',
      label: 'Сделка',
      render: (task) => task.dealTitle,
    },
    {
      key: 'description',
      label: 'Описание',
      cellClassName: classes.descriptionCell,
      render: (task) => task.description,
    },
    {
      key: 'dueDate',
      label: 'Выполнить до',
      cellClassName: classes.dateCell,
      render: (task) => formatDate(task.dueDate),
    },
    {
      key: 'assignee',
      label: 'Исполнитель',
      cellClassName: classes.assigneeCell,
      render: (task) => task.assigneeName,
    },
    {
      key: 'status',
      label: 'Статус',
      cellClassName: classes.statusCell,
      render: (task) => (
        <span className={statusClassByStatus[task.status]}>
          {taskStatusLabels[task.status]}
        </span>
      ),
    },
    {
      key: 'createdAt',
      label: 'Дата создания',
      cellClassName: classes.createdDateCell,
      render: (task) => formatDate(task.createdAt),
    },
  ];
}

export function TasksTable({
  tasks,
  search,
  currentPage,
  disabledCreate = false,
  sort,
  totalPages,
  unfilteredTotal,
  onCreate,
  onPageChange,
  onSearchChange,
  onSortChange,
  onRowClick,
}: TasksTableProps) {
  return (
    <PagedEntityTable
      classNames={classes}
      columns={createTaskColumns()}
      createButtonClassName={classes.newTaskButton}
      createLabel='Новая задача'
      currentPage={currentPage}
      disabledCreate={disabledCreate}
      emptyText='Задач пока нет'
      filteredEmptyText='Задачи не найдены'
      getItemKey={(task) => task.id}
      items={tasks}
      mobileCardClassName={(_task, index) =>
        cx(classes.mobileCard, index !== 0 && classes.mobileCardHighlighted)
      }
      mobileCreateButtonClassName={classes.mobileNewTaskButton}
      renderMobileCard={renderMobileTaskCard}
      rowClassName={(_task, index) =>
        cx(classes.row, index !== 0 && classes.rowHighlighted)
      }
      search={search}
      searchAriaLabel='Искать задачи'
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

function renderMobileTaskCard(task: TaskTableRow) {
  return (
    <>
      <span className={classes.mobileCardHeader}>
        <span className={classes.mobileTitleGroup}>
          <span className={classes.mobileTitle}>{task.title}</span>
          <span className={classes.mobileProject}>{task.dealTitle}</span>
        </span>
        <span
          className={cx(classes.mobileStatus, statusClassByStatus[task.status])}
        >
          {taskStatusLabels[task.status]}
        </span>
      </span>
      <span className={classes.mobileDescription}>{task.description}</span>
      <span className={classes.mobileDueDate}>
        выполнить до {formatDate(task.dueDate)}
      </span>
      <span className={classes.mobileMetaRow}>
        <span className={classes.mobileAssigneeGroup}>
          <span className={classes.mobileAssignee}>{task.assigneeName}</span>
          <span className={classes.mobileAssigneeLabel}>Исполнитель</span>
        </span>
        <span className={classes.mobileCreatedDate}>
          {formatDate(task.createdAt)}
        </span>
      </span>
    </>
  );
}
