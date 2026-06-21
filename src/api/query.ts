import {
  sortItems,
  type SortDirection,
  type SortValue,
} from '../utils/sorting';

export type Page<T> = {
  items: T[];
  total: number;
  unfilteredTotal: number;
};

export type SearchParams = {
  search?: string;
};

export type PaginationParams = {
  limit?: number;
  offset?: number;
};

export type SortParams<SortKey extends string = string> = {
  sortBy?: SortKey;
  sortDirection?: SortDirection;
};

export type QueryParams<SortKey extends string = string> = SearchParams &
  PaginationParams &
  SortParams<SortKey>;

export function normalizeSearch(search?: string) {
  return search?.trim().toLowerCase() ?? '';
}

export function paginateItems<T>(
  items: T[],
  { limit, offset = 0 }: PaginationParams = {},
  unfilteredTotal = items.length,
): Page<T> {
  if (!limit || limit <= 0) {
    return { items, total: items.length, unfilteredTotal };
  }

  return {
    items: items.slice(offset, offset + limit),
    total: items.length,
    unfilteredTotal,
  };
}

export function applySort<T, SortKey extends string>(
  items: T[],
  sort: SortParams<SortKey>,
  getValue: (item: T, key: SortKey) => SortValue,
) {
  if (!sort.sortBy || !sort.sortDirection) {
    return items;
  }

  return sortItems(
    items,
    { key: sort.sortBy, direction: sort.sortDirection },
    getValue,
  );
}
