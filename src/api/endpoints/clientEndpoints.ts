import type {
  Client,
  CreateClientPayload,
  UpdateClientPayload,
} from '../../types/client';
import {
  getClientsPage,
  type ClientPage,
  type GetClientsParams,
} from '../adapters/clientQueryAdapter';
import {
  getClientOptions,
  type GetClientOptionsParams,
  type OptionList,
} from '../adapters/optionQueryAdapter';
import { crmApi } from '../crmApi';

const listId = 'LIST';

type CreateClientParams = CreateClientPayload &
  Pick<Client, 'id' | 'createdAt' | 'createdBy' | 'deleted'>;

export const clientEndpoints = crmApi.injectEndpoints({
  endpoints: (builder) => ({
    getClients: builder.query<ClientPage, GetClientsParams>({
      async queryFn(params, _api, _extraOptions, baseQuery) {
        return getClientsPage(params, baseQuery);
      },
      providesTags: (result) =>
        result
          ? [
              ...result.items.map(
                ({ id }) => ({ type: 'Clients', id }) as const,
              ),
              { type: 'Clients', id: listId },
            ]
          : [{ type: 'Clients', id: listId }],
    }),
    getClientOptions: builder.query<OptionList, GetClientOptionsParams>({
      async queryFn(params, _api, _extraOptions, baseQuery) {
        return getClientOptions(params, baseQuery);
      },
      providesTags: [{ type: 'Clients', id: listId }],
    }),
    createClient: builder.mutation<Client, CreateClientParams>({
      query: (body) => ({ url: '/clients', method: 'POST', body }),
      invalidatesTags: [{ type: 'Clients', id: listId }, 'Deals', 'Tasks'],
    }),
    updateClient: builder.mutation<
      Client,
      UpdateClientPayload & Pick<Client, 'id'>
    >({
      query: ({ id, ...body }) => ({
        url: `/clients/${id}`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'Clients', id },
        { type: 'Clients', id: listId },
        'Deals',
      ],
    }),
    deleteClient: builder.mutation<Client, Pick<Client, 'id'>>({
      query: ({ id }) => ({
        url: `/clients/${id}`,
        method: 'PATCH',
        body: { deleted: true },
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'Clients', id },
        { type: 'Clients', id: listId },
        'Deals',
      ],
    }),
  }),
});

export const {
  useGetClientsQuery,
  useGetClientOptionsQuery,
  useCreateClientMutation,
  useUpdateClientMutation,
  useDeleteClientMutation,
} = clientEndpoints;
