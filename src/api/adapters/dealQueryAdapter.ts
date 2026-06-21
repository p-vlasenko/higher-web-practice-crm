import type { Client } from '../../types/client';
import type { Deal, DealSortKey } from '../../types/deal';
import {
  dealStatusLabels,
  formatCurrency,
  formatDate,
} from '../../utils/formatters';
import {
  createDealTableRows,
  type DealTableRow,
} from '../../utils/relationReadModels';
import { applySort, normalizeSearch, paginateItems, type Page } from '../query';
import type {
  WithPagination,
  WithSearch,
  WithSort,
  WithUser,
} from '../endpoints/endpointTypes';
import type { AdapterBaseQuery } from './baseQueryAdapter';

export type GetDealsParams =
  | (WithUser & WithSearch & WithPagination & WithSort<DealSortKey>)
  | void;

export type DealPage = Page<DealTableRow>;

function matchesDealSearch(deal: DealTableRow, query: string) {
  return [
    deal.title,
    deal.clientName,
    deal.description,
    dealStatusLabels[deal.status],
    formatCurrency(deal.amount),
    formatDate(deal.createdAt),
    formatDate(deal.completedAt),
  ]
    .filter(Boolean)
    .some((value) => value?.toLowerCase().includes(query));
}

function getDealSortValue(deal: DealTableRow, sortBy: DealSortKey) {
  switch (sortBy) {
    case 'title':
      return deal.title;
    case 'client':
      return deal.clientName;
    case 'description':
      return deal.description;
    case 'status':
      return dealStatusLabels[deal.status];
    case 'amount':
      return deal.amount;
    case 'createdAt':
      return deal.createdAt;
    case 'completedAt':
      return deal.completedAt;
    default:
      return undefined;
  }
}

export async function getDealsPage(
  params: GetDealsParams,
  baseQuery: AdapterBaseQuery,
) {
  const ownerParams = params?.userId ? { createdBy: params.userId } : undefined;

  const dealsResult = await baseQuery({
    url: '/deals',
    params: ownerParams,
  });

  if (dealsResult.error) {
    return { error: dealsResult.error };
  }

  const clientsResult = await baseQuery({
    url: '/clients',
    params: ownerParams,
  });

  if (clientsResult.error) {
    return { error: clientsResult.error };
  }

  const query = normalizeSearch(params?.search);
  const clients = clientsResult.data as Client[];
  let deals = createDealTableRows(dealsResult.data as Deal[], clients);
  const unfilteredTotal = deals.length;

  if (query) {
    deals = deals.filter((deal) => matchesDealSearch(deal, query));
  }

  deals = applySort(deals, params ?? {}, (deal, key) =>
    getDealSortValue(deal, key),
  );

  return {
    data: paginateItems(deals, params ?? {}, unfilteredTotal),
  };
}
