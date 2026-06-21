import type {
  RegisterPayload,
  UpdateProfilePayload,
  User,
} from '../../types/user';
import {
  getUserOptions,
  type OptionList,
} from '../adapters/optionQueryAdapter';
import { crmApi } from '../crmApi';

const listId = 'LIST';

export const userEndpoints = crmApi.injectEndpoints({
  endpoints: (builder) => ({
    getUsers: builder.query<User[], { email?: string } | void>({
      query: (params) => ({ url: '/users', params: params ?? undefined }),
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'Users' as const, id })),
              { type: 'Users', id: listId },
            ]
          : [{ type: 'Users', id: listId }],
    }),
    getUserOptions: builder.query<OptionList, void>({
      async queryFn(_params, _api, _extraOptions, baseQuery) {
        return getUserOptions(baseQuery);
      },
      providesTags: [{ type: 'Users', id: listId }],
    }),
    createUser: builder.mutation<
      User,
      RegisterPayload & Pick<User, 'id' | 'createdAt'>
    >({
      query: (body) => ({ url: '/users', method: 'POST', body }),
      invalidatesTags: [{ type: 'Users', id: listId }],
    }),
    updateUser: builder.mutation<User, UpdateProfilePayload & Pick<User, 'id'>>(
      {
        query: ({ id, ...body }) => ({
          url: `/users/${id}`,
          method: 'PATCH',
          body,
        }),
        invalidatesTags: (_result, _error, { id }) => [
          { type: 'Users', id },
          { type: 'Users', id: listId },
          'Tasks',
        ],
      },
    ),
    deleteUser: builder.mutation<void, Pick<User, 'id'>>({
      query: ({ id }) => ({ url: `/users/${id}`, method: 'DELETE' }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'Users', id },
        { type: 'Users', id: listId },
        'Clients',
        'Deals',
        'Tasks',
      ],
    }),
  }),
});

export const {
  useGetUsersQuery,
  useGetUserOptionsQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
} = userEndpoints;
