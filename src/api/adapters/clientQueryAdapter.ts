import type { Client, ClientSortKey } from '../../types/client';
import { formatDate } from '../../utils/formatters';
import { applySort, normalizeSearch, paginateItems, type Page } from '../query';
import type {
  WithPagination,
  WithSearch,
  WithSort,
  WithUser,
} from '../endpoints/endpointTypes';
import type { AdapterBaseQuery } from './baseQueryAdapter';

export type GetClientsParams =
  | (WithUser &
      WithSearch &
      WithPagination &
      WithSort<ClientSortKey> & {
        deleted?: boolean;
      })
  | void;

export type ClientPage = Page<Client>;

function matchesClientSearch(client: Client, query: string) {
  return [
    client.name,
    client.phone,
    client.email,
    client.company,
    client.website,
    client.comment,
    formatDate(client.createdAt),
  ]
    .filter(Boolean)
    .some((value) => value?.toLowerCase().includes(query));
}

function getClientSortValue(client: Client, sortBy: ClientSortKey) {
  switch (sortBy) {
    case 'name':
      return client.name;
    case 'phone':
      return client.phone;
    case 'email':
      return client.email;
    case 'company':
      return client.company;
    case 'website':
      return client.website;
    case 'comment':
      return client.comment;
    case 'createdAt':
      return client.createdAt;
    default:
      return undefined;
  }
}

export async function getClientsPage(
  params: GetClientsParams,
  baseQuery: AdapterBaseQuery,
) {
  const clientsResult = await baseQuery({
    url: '/clients',
    params: {
      ...(params?.userId ? { createdBy: params.userId } : {}),
      ...(typeof params?.deleted === 'boolean'
        ? { deleted: params.deleted }
        : {}),
    },
  });

  if (clientsResult.error) {
    return { error: clientsResult.error };
  }

  let clients = clientsResult.data as Client[];
  const unfilteredTotal = clients.length;
  const query = normalizeSearch(params?.search);

  if (query) {
    clients = clients.filter((client) => matchesClientSearch(client, query));
  }

  clients = applySort(clients, params ?? {}, getClientSortValue);

  return {
    data: paginateItems(clients, params ?? {}, unfilteredTotal),
  };
}
