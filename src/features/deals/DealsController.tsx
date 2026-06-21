import { useEffect, useState } from 'react';

import {
  useCreateDealMutation,
  useGetClientOptionsQuery,
  useGetDealsQuery,
  useUpdateDealMutation,
} from '../../api/endpoints/crmEndpoints';
import { useAppSelector } from '../../app/hooks';
import { usePagedQueryState } from '../../components/table/usePagedQueryState';
import type { Deal, DealSortKey } from '../../types/deal';
import { DealModal } from './DealModal';
import { DealsTable } from './DealsTable';
import { toDealPayload } from './dealService';

const dealsPageSize = 15;

export function DealsController() {
  const userId = useAppSelector((state) => state.session.user?.id ?? null);
  const query = usePagedQueryState<DealSortKey>({ pageSize: dealsPageSize });

  const { data: clientOptions = [] } = useGetClientOptionsQuery({
    userId: userId ?? undefined,
  });

  const { data: dealPage = { items: [], total: 0, unfilteredTotal: 0 } } =
    useGetDealsQuery({
      limit: query.limit,
      offset: query.offset,
      search: query.search,
      sortBy: query.sort?.key,
      sortDirection: query.sort?.direction,
      userId: userId ?? undefined,
    });

  const [createDeal, createState] = useCreateDealMutation();
  const [updateDeal, updateState] = useUpdateDealMutation();

  const [selected, setSelected] = useState<Deal | null>(null);
  const [opened, setOpened] = useState(false);

  const totalPages = query.totalPages(dealPage.total);

  useEffect(() => {
    query.clampPage(dealPage.total);
  }, [dealPage.total, query]);

  return (
    <>
      <DealsTable
        currentPage={query.currentPage}
        deals={dealPage.items}
        disabledCreate={clientOptions.length === 0}
        search={query.search}
        sort={query.sort}
        totalPages={totalPages}
        unfilteredTotal={dealPage.unfilteredTotal}
        onCreate={() => {
          setSelected(null);
          setOpened(true);
        }}
        onPageChange={(nextPage) => query.setPage(nextPage, totalPages)}
        onSearchChange={query.setSearch}
        onSortChange={query.setSort}
        onRowClick={(deal) => {
          setSelected(deal);
          setOpened(true);
        }}
      />
      <DealModal
        opened={opened}
        deal={selected}
        clientOptions={clientOptions}
        loading={createState.isLoading || updateState.isLoading}
        onClose={() => setOpened(false)}
        onSubmit={async (values) => {
          if (!userId) return;

          if (selected) {
            await updateDeal({
              id: selected.id,
              ...values,
              amount: Number(values.amount),
            });
          } else {
            await createDeal(toDealPayload(values, userId));
          }
          setOpened(false);
        }}
      />
    </>
  );
}
