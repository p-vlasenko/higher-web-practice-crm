import { useCallback, useMemo, useState } from 'react';

import type { SortState } from '../../utils/sorting';

type UsePagedQueryStateParams = {
  pageSize: number;
};

export function usePagedQueryState<SortKey extends string>({
  pageSize,
}: UsePagedQueryStateParams) {
  const [search, setSearchState] = useState('');
  const [currentPage, setCurrentPageState] = useState(1);
  const [sort, setSortState] = useState<SortState<SortKey> | null>(null);

  const totalPages = useCallback(
    (total: number) => Math.max(1, Math.ceil(total / pageSize)),
    [pageSize],
  );

  const clampPage = useCallback(
    (total: number) => {
      const maxPage = totalPages(total);

      setCurrentPageState((page) => Math.max(1, Math.min(page, maxPage)));
    },
    [totalPages],
  );

  const setPage = useCallback((nextPage: number, maxPage?: number) => {
    const normalizedPage = Math.max(1, nextPage);

    setCurrentPageState(
      maxPage ? Math.min(normalizedPage, maxPage) : normalizedPage,
    );
  }, []);

  const setSearch = useCallback((nextSearch: string) => {
    setSearchState(nextSearch);
    setCurrentPageState(1);
  }, []);

  const setSort = useCallback((nextSort: SortState<SortKey> | null) => {
    setSortState(nextSort);
    setCurrentPageState(1);
  }, []);

  return useMemo(
    () => ({
      currentPage,
      clampPage,
      limit: pageSize,
      offset: (currentPage - 1) * pageSize,
      search,
      sort,
      totalPages,
      setPage,
      setSearch,
      setSort,
    }),
    [
      clampPage,
      currentPage,
      pageSize,
      search,
      setPage,
      setSearch,
      setSort,
      sort,
      totalPages,
    ],
  );
}
