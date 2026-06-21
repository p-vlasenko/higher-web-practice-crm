import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

import { getApiBaseUrl } from './config';

export const crmApi = createApi({
  reducerPath: 'crmApi',
  baseQuery: fetchBaseQuery({ baseUrl: getApiBaseUrl() }),
  tagTypes: ['Users', 'Clients', 'Deals', 'Tasks'],
  endpoints: () => ({}),
});
