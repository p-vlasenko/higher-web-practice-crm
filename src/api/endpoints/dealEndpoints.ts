import type {
  CreateDealPayload,
  Deal,
  UpdateDealPayload,
} from '../../types/deal';
import {
  getDealsPage,
  type DealPage,
  type GetDealsParams,
} from '../adapters/dealQueryAdapter';
import {
  getDealOptions,
  type GetDealOptionsParams,
  type OptionList,
} from '../adapters/optionQueryAdapter';
import { crmApi } from '../crmApi';

const listId = 'LIST';

export const dealEndpoints = crmApi.injectEndpoints({
  endpoints: (builder) => ({
    getDeals: builder.query<DealPage, GetDealsParams>({
      async queryFn(params, _api, _extraOptions, baseQuery) {
        return getDealsPage(params, baseQuery);
      },
      providesTags: (result) =>
        result
          ? [
              ...result.items.map(({ id }) => ({ type: 'Deals', id }) as const),
              { type: 'Deals', id: listId },
            ]
          : [{ type: 'Deals', id: listId }],
    }),
    getDealOptions: builder.query<OptionList, GetDealOptionsParams>({
      async queryFn(params, _api, _extraOptions, baseQuery) {
        return getDealOptions(params, baseQuery);
      },
      providesTags: [{ type: 'Deals', id: listId }],
    }),
    createDeal: builder.mutation<
      Deal,
      CreateDealPayload &
        Pick<Deal, 'id' | 'createdAt' | 'createdBy' | 'status'> &
        Partial<Pick<Deal, 'completedAt'>>
    >({
      query: (body) => ({ url: '/deals', method: 'POST', body }),
      invalidatesTags: [{ type: 'Deals', id: listId }, 'Clients'],
    }),
    updateDeal: builder.mutation<Deal, UpdateDealPayload & Pick<Deal, 'id'>>({
      query: ({ id, ...body }) => ({
        url: `/deals/${id}`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'Deals', id },
        { type: 'Deals', id: listId },
        'Clients',
        'Tasks',
      ],
    }),
    completeDeal: builder.mutation<Deal, Pick<Deal, 'id'>>({
      query: ({ id }) => ({
        url: `/deals/${id}`,
        method: 'PATCH',
        body: {
          status: 'completed',
          completedAt: new Date().toISOString(),
        },
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'Deals', id },
        { type: 'Deals', id: listId },
        'Clients',
        'Tasks',
      ],
    }),
    deleteDeal: builder.mutation<void, Pick<Deal, 'id'>>({
      query: ({ id }) => ({
        url: `/deals/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'Deals', id },
        { type: 'Deals', id: listId },
        'Clients',
        'Tasks',
      ],
    }),
  }),
});

export const {
  useCompleteDealMutation,
  useGetDealsQuery,
  useGetDealOptionsQuery,
  useCreateDealMutation,
  useDeleteDealMutation,
  useUpdateDealMutation,
} = dealEndpoints;
