import type { LoginPayload, User } from '../../types/user';
import type { AdapterBaseQuery } from './baseQueryAdapter';

export async function getUserByCredentials(
  payload: LoginPayload,
  baseQuery: AdapterBaseQuery,
) {
  const usersResult = await baseQuery({ url: '/users' });

  if (usersResult.error) {
    return { error: usersResult.error };
  }

  const users = usersResult.data as User[];
  const user = users.find(
    (candidate) =>
      candidate.email.toLowerCase() === payload.email.toLowerCase() &&
      candidate.password === payload.password,
  );

  return { data: user };
}
