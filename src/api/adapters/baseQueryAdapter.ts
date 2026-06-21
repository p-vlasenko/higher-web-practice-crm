import type { FetchArgs, FetchBaseQueryError } from '@reduxjs/toolkit/query';

export type AdapterBaseQueryResult = {
  data?: unknown;
  error?: FetchBaseQueryError;
};

export type AdapterBaseQuery = (
  arg: FetchArgs,
) => AdapterBaseQueryResult | PromiseLike<AdapterBaseQueryResult>;
