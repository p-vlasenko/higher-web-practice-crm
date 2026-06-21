import { useEffect, useState } from 'react';

import {
  useCreateClientMutation,
  useDeleteClientMutation,
  useGetClientsQuery,
  useUpdateClientMutation,
} from '../../api/endpoints/crmEndpoints';
import { useAppSelector } from '../../app/hooks';
import { usePagedQueryState } from '../../components/table/usePagedQueryState';
import type { Client, ClientSortKey } from '../../types/client';
import { ClientModal } from './ClientModal';
import { ClientsTable } from './ClientsTable';
import { toClientPayload } from './clientService';

const clientsPageSize = 15;

export function ClientsController() {
  const userId = useAppSelector((state) => state.session.user?.id ?? null);

  const query = usePagedQueryState<ClientSortKey>({
    pageSize: clientsPageSize,
  });

  const { data: clientPage = { items: [], total: 0, unfilteredTotal: 0 } } =
    useGetClientsQuery({
      limit: query.limit,
      offset: query.offset,
      search: query.search,
      sortBy: query.sort?.key,
      sortDirection: query.sort?.direction,
      userId: userId ?? undefined,
    });

  const [createClient, createState] = useCreateClientMutation();
  const [updateClient, updateState] = useUpdateClientMutation();
  const [deleteClient] = useDeleteClientMutation();

  const [selected, setSelected] = useState<Client | null>(null);
  const [opened, setOpened] = useState(false);

  const totalPages = query.totalPages(clientPage.total);

  useEffect(() => {
    query.clampPage(clientPage.total);
  }, [clientPage.total, query]);

  return (
    <>
      <ClientsTable
        clients={clientPage.items}
        currentPage={query.currentPage}
        search={query.search}
        sort={query.sort}
        totalPages={totalPages}
        unfilteredTotal={clientPage.unfilteredTotal}
        onCreate={() => {
          setSelected(null);
          setOpened(true);
        }}
        onPageChange={(nextPage) => query.setPage(nextPage, totalPages)}
        onSearchChange={query.setSearch}
        onSortChange={query.setSort}
        onRowClick={(client) => {
          setSelected(client);
          setOpened(true);
        }}
      />
      <ClientModal
        opened={opened}
        client={selected}
        loading={createState.isLoading || updateState.isLoading}
        onClose={() => setOpened(false)}
        onDelete={
          selected
            ? async () => {
                await deleteClient({ id: selected.id });
                setOpened(false);
              }
            : undefined
        }
        onSubmit={async (values) => {
          if (!userId) {
            return;
          }

          if (selected) {
            await updateClient({ id: selected.id, ...values });
          } else {
            await createClient(toClientPayload(values, userId));
          }

          setOpened(false);
        }}
      />
    </>
  );
}
