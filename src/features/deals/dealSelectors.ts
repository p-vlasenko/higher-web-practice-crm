import type { Deal } from '../../types/deal';

export function selectUserDeals(deals: Deal[], userId?: string | null) {
  return deals.filter((deal) => !userId || deal.createdBy === userId);
}

export function selectActiveDeals(deals: Deal[]) {
  return deals.filter(
    (deal) => deal.status === 'new' || deal.status === 'in_progress',
  );
}
