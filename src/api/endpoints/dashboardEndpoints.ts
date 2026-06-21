import type { DashboardResponse } from '../../types/dashboard';
import { getDashboardData } from '../adapters/dashboardQueryAdapter';
import { crmApi } from '../crmApi';
import type { WithUser } from './endpointTypes';

export const dashboardEndpoints = crmApi.injectEndpoints({
  endpoints: (builder) => ({
    getDashboard: builder.query<DashboardResponse, WithUser | void>({
      async queryFn(params, _api, _extraOptions, baseQuery) {
        return getDashboardData(params, baseQuery);
      },
      providesTags: ['Clients', 'Deals', 'Tasks'],
    }),
  }),
});

export const { useGetDashboardQuery } = dashboardEndpoints;
