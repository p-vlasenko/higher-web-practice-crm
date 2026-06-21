import { useEffect, useState } from 'react';

import {
  useCreateTaskMutation,
  useGetDealOptionsQuery,
  useGetTasksQuery,
  useGetUserOptionsQuery,
  useUpdateTaskMutation,
} from '../../api/endpoints/crmEndpoints';
import { useAppSelector } from '../../app/hooks';
import { usePagedQueryState } from '../../components/table/usePagedQueryState';
import type { Task, TaskSortKey } from '../../types/task';
import { TaskModal } from './TaskModal';
import { TasksTable } from './TasksTable';
import { toTaskPayload } from './taskService';

const tasksPageSize = 15;

export function TasksController() {
  const userId = useAppSelector((state) => state.session.user?.id ?? null);
  const query = usePagedQueryState<TaskSortKey>({ pageSize: tasksPageSize });
  const { data: assigneeOptions = [] } = useGetUserOptionsQuery();
  const { data: dealOptions = [] } = useGetDealOptionsQuery({
    userId: userId ?? undefined,
  });

  const { data: taskPage = { items: [], total: 0, unfilteredTotal: 0 } } =
    useGetTasksQuery({
      limit: query.limit,
      offset: query.offset,
      search: query.search,
      sortBy: query.sort?.key,
      sortDirection: query.sort?.direction,
      userId: userId ?? undefined,
    });

  const [createTask, createState] = useCreateTaskMutation();
  const [updateTask, updateState] = useUpdateTaskMutation();
  const [selected, setSelected] = useState<Task | null>(null);
  const [opened, setOpened] = useState(false);
  const totalPages = query.totalPages(taskPage.total);

  useEffect(() => {
    query.clampPage(taskPage.total);
  }, [query, taskPage.total]);

  return (
    <>
      <TasksTable
        currentPage={query.currentPage}
        disabledCreate={dealOptions.length === 0}
        search={query.search}
        sort={query.sort}
        tasks={taskPage.items}
        totalPages={totalPages}
        unfilteredTotal={taskPage.unfilteredTotal}
        onCreate={() => {
          setSelected(null);
          setOpened(true);
        }}
        onPageChange={(nextPage) => query.setPage(nextPage, totalPages)}
        onSearchChange={query.setSearch}
        onSortChange={query.setSort}
        onRowClick={(task) => {
          setSelected(task);
          setOpened(true);
        }}
      />
      {userId ? (
        <TaskModal
          opened={opened}
          task={selected}
          assigneeOptions={assigneeOptions}
          currentUserId={userId}
          dealOptions={dealOptions}
          loading={createState.isLoading || updateState.isLoading}
          onClose={() => setOpened(false)}
          onSubmit={async (values) => {
            if (selected) {
              await updateTask({ id: selected.id, ...values });
            } else {
              await createTask(toTaskPayload(values, userId));
            }
            
            setOpened(false);
          }}
        />
      ) : null}
    </>
  );
}
