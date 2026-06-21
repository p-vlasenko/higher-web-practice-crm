import type { Client } from '../../types/client';
import type { Deal } from '../../types/deal';
import type { Task } from '../../types/task';
import { buildDashboardData } from '../dashboard';
import type { WithUser } from '../endpoints/endpointTypes';
import type { AdapterBaseQuery } from './baseQueryAdapter';

export async function getDashboardData(
  params: WithUser | void,
  baseQuery: AdapterBaseQuery,
) {
  const ownerParams = params?.userId ? { createdBy: params.userId } : undefined;

  const [clientsResult, dealsResult, tasksResult] = await Promise.all([
    baseQuery({ url: '/clients', params: ownerParams }),
    baseQuery({ url: '/deals', params: ownerParams }),
    baseQuery({ url: '/tasks', params: ownerParams }),
  ]);

  if (clientsResult.error) {
    return { error: clientsResult.error };
  }

  if (dealsResult.error) {
    return { error: dealsResult.error };
  }

  if (tasksResult.error) {
    return { error: tasksResult.error };
  }

  return {
    data: buildDashboardData(
      clientsResult.data as Client[],
      dealsResult.data as Deal[],
      tasksResult.data as Task[],
    ),
  };
}
