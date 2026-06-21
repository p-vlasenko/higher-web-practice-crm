import {
  getClientActivityReportPage,
  getNewClientsReportPage,
  getOverdueTasksReportPage,
  getSalesReportPage,
  getStageReportPage,
} from '../adapters/reportQueryAdapter';
import type {
  ClientActivityReportRow,
  DealsStageReportRow,
  NewClientReportRow,
  OverdueTaskReportRow,
  ReportPage,
  ReportQueryParams,
  SalesReportRow,
} from '../../types/reports';
import { crmApi } from '../crmApi';

export const reportEndpoints = crmApi.injectEndpoints({
  endpoints: (builder) => ({
    getSalesReport: builder.query<
      ReportPage<SalesReportRow>,
      ReportQueryParams
    >({
      async queryFn(params, _api, _extraOptions, baseQuery) {
        return getSalesReportPage(params, baseQuery);
      },
      providesTags: ['Clients', 'Deals'],
    }),
    getStageReport: builder.query<
      ReportPage<DealsStageReportRow>,
      ReportQueryParams
    >({
      async queryFn(params, _api, _extraOptions, baseQuery) {
        return getStageReportPage(params, baseQuery);
      },
      providesTags: ['Deals'],
    }),
    getNewClientsReport: builder.query<
      ReportPage<NewClientReportRow>,
      ReportQueryParams
    >({
      async queryFn(params, _api, _extraOptions, baseQuery) {
        return getNewClientsReportPage(params, baseQuery);
      },
      providesTags: ['Clients'],
    }),
    getClientActivityReport: builder.query<
      ReportPage<ClientActivityReportRow>,
      ReportQueryParams
    >({
      async queryFn(params, _api, _extraOptions, baseQuery) {
        return getClientActivityReportPage(params, baseQuery);
      },
      providesTags: ['Clients', 'Deals', 'Tasks'],
    }),
    getOverdueTasksReport: builder.query<
      ReportPage<OverdueTaskReportRow>,
      ReportQueryParams
    >({
      async queryFn(params, _api, _extraOptions, baseQuery) {
        return getOverdueTasksReportPage(params, baseQuery);
      },
      providesTags: ['Tasks', 'Users'],
    }),
  }),
});

export const {
  useGetClientActivityReportQuery,
  useGetNewClientsReportQuery,
  useGetOverdueTasksReportQuery,
  useGetSalesReportQuery,
  useGetStageReportQuery,
} = reportEndpoints;
