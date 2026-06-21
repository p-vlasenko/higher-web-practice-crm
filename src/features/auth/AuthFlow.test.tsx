import { describe, expect, it } from '@jest/globals';

import { findUserByCredentials } from './authService';

describe('auth flow behavior contract', () => {
  it('finds a user by valid credentials only', () => {
    const users = [
      {
        id: '1',
        email: 'manager@crm.ru',
        password: '123456',
        name: 'Manager',
        createdAt: '2026-01-01',
      },
    ];
    expect(
      findUserByCredentials(users, {
        email: 'manager@crm.ru',
        password: '123456',
      })?.id,
    ).toBe('1');
    expect(
      findUserByCredentials(users, {
        email: 'manager@crm.ru',
        password: 'badpass',
      }),
    ).toBeUndefined();
  });
});
