import type {
  CreateTaskPayload,
  Task,
  UpdateTaskPayload,
} from '../../types/task';
import {
  getTasksPage,
  type GetTasksParams,
  type TaskPage,
} from '../adapters/taskQueryAdapter';
import { crmApi } from '../crmApi';

const listId = 'LIST';

export const taskEndpoints = crmApi.injectEndpoints({
  endpoints: (builder) => ({
    getTasks: builder.query<TaskPage, GetTasksParams>({
      async queryFn(params, _api, _extraOptions, baseQuery) {
        return getTasksPage(params, baseQuery);
      },
      providesTags: (result) =>
        result
          ? [
              ...result.items.map(({ id }) => ({ type: 'Tasks', id }) as const),
              { type: 'Tasks', id: listId },
            ]
          : [{ type: 'Tasks', id: listId }],
    }),
    createTask: builder.mutation<
      Task,
      CreateTaskPayload &
        Pick<Task, 'id' | 'createdAt' | 'createdBy' | 'status'>
    >({
      query: (body) => ({ url: '/tasks', method: 'POST', body }),
      invalidatesTags: [{ type: 'Tasks', id: listId }, 'Deals'],
    }),
    updateTask: builder.mutation<Task, UpdateTaskPayload & Pick<Task, 'id'>>({
      query: ({ id, ...body }) => ({
        url: `/tasks/${id}`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'Tasks', id },
        { type: 'Tasks', id: listId },
        'Deals',
      ],
    }),
    completeTask: builder.mutation<Task, Pick<Task, 'id'>>({
      query: ({ id }) => ({
        url: `/tasks/${id}`,
        method: 'PATCH',
        body: { status: 'completed' },
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'Tasks', id },
        { type: 'Tasks', id: listId },
        'Deals',
      ],
    }),
    deleteTask: builder.mutation<void, Pick<Task, 'id'>>({
      query: ({ id }) => ({
        url: `/tasks/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'Tasks', id },
        { type: 'Tasks', id: listId },
        'Deals',
      ],
    }),
  }),
});

export const {
  useCompleteTaskMutation,
  useGetTasksQuery,
  useCreateTaskMutation,
  useDeleteTaskMutation,
  useUpdateTaskMutation,
} = taskEndpoints;
