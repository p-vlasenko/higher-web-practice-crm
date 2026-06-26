import { describe, expect, it } from '@jest/globals';

import type { AdapterBaseQuery } from '../../api/adapters/baseQueryAdapter';
import { getUserByCredentials } from '../../api/adapters/authQueryAdapter';

describe('auth flow behavior contract', () => {
  it('finds a user by valid credentials only', async () => {
    const users = [
      {
        accountName: 'manager',
        id: '1',
        email: 'manager@crm.ru',
        password: '123456',
        firstName: 'Manager',
        lastName: 'User',
        createdAt: '2026-01-01',
      },
    ];
    const baseQuery: AdapterBaseQuery = async () => ({ data: users });

    await expect(
      getUserByCredentials(
        {
          email: 'manager@crm.ru',
          password: '123456',
        },
        baseQuery,
      ),
    ).resolves.toEqual({ data: users[0] });
    await expect(
      getUserByCredentials(
        {
          email: 'manager@crm.ru',
          password: 'badpass',
        },
        baseQuery,
      ),
    ).resolves.toEqual({ data: undefined });
  });

  it('passes API errors through to the caller', async () => {
    const baseQuery: AdapterBaseQuery = async () => ({
      error: { status: 500, data: 'Server error' },
    });

    await expect(
      getUserByCredentials(
        {
          email: 'manager@crm.ru',
          password: '123456',
        },
        baseQuery,
      ),
    ).resolves.toEqual({ error: { status: 500, data: 'Server error' } });
  });
});
