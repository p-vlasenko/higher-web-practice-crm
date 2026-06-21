import type { PaginationParams, SearchParams, SortParams } from '../query';

export type WithUser = { userId?: string };

export type WithSearch = SearchParams;

export type WithPagination = PaginationParams;

export type WithSort<SortKey extends string = string> = SortParams<SortKey>;
