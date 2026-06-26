import type { Client } from '../../types/client';
import type { Deal } from '../../types/deal';
import type { EntityOption } from '../../types/options';
import type { User } from '../../types/user';
import { isActiveClient } from '../../utils/clients';
import {
  createClientOptions,
  createDealOptions,
  createUserOptions,
} from '../../utils/optionReadModels';
import type { WithUser } from '../endpoints/endpointTypes';
import type { AdapterBaseQuery } from './baseQueryAdapter';

export type GetClientOptionsParams = WithUser | void;
export type GetDealOptionsParams = WithUser | void;

function ownerParams(params?: WithUser) {
  return params?.userId ? { createdBy: params.userId } : undefined;
}

function normalizeParams(params: WithUser | void) {
  return params ?? undefined;
}

export async function getClientOptions(
  params: GetClientOptionsParams,
  baseQuery: AdapterBaseQuery,
) {
  const clientsResult = await baseQuery({
    url: '/clients',
    params: ownerParams(normalizeParams(params)),
  });

  if (clientsResult.error) {
    return { error: clientsResult.error };
  }

  return {
    data: createClientOptions(
      (clientsResult.data as Client[]).filter(isActiveClient),
    ),
  };
}

export async function getDealOptions(
  params: GetDealOptionsParams,
  baseQuery: AdapterBaseQuery,
) {
  const dealsResult = await baseQuery({
    url: '/deals',
    params: ownerParams(normalizeParams(params)),
  });

  if (dealsResult.error) {
    return { error: dealsResult.error };
  }

  return {
    data: createDealOptions(dealsResult.data as Deal[]),
  };
}

export async function getUserOptions(baseQuery: AdapterBaseQuery) {
  const usersResult = await baseQuery({ url: '/users' });

  if (usersResult.error) {
    return { error: usersResult.error };
  }

  return {
    data: createUserOptions(usersResult.data as User[]),
  };
}

export type OptionList = EntityOption[];
