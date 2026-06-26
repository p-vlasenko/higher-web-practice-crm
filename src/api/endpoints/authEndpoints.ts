import type { LoginPayload, User } from '../../types/user';
import { getUserByCredentials } from '../adapters/authQueryAdapter';
import { crmApi } from '../crmApi';

export const authEndpoints = crmApi.injectEndpoints({
  endpoints: (builder) => ({
    getUserByCredentials: builder.mutation<User | undefined, LoginPayload>({
      async queryFn(payload, _api, _extraOptions, baseQuery) {
        return getUserByCredentials(payload, baseQuery);
      },
    }),
  }),
});

export const { useGetUserByCredentialsMutation } = authEndpoints;
