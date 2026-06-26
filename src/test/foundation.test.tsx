import { describe, expect, test } from '@jest/globals';

import sessionReducer, {
  loginSucceeded,
  logout,
} from '../features/auth/sessionSlice';

describe('session reducer', () => {
  test('stores authenticated and anonymous states', () => {
    const user = {
      accountName: 'user',
      id: 'user-1',
      email: 'user@example.com',
      firstName: 'User',
      lastName: 'Example',
      createdAt: '2026-01-01T00:00:00.000Z',
      password: 'secret',
    };

    const loggedIn = sessionReducer(
      { user: null, status: 'anonymous' },
      loginSucceeded(user),
    );

    expect(loggedIn).toEqual({
      user: {
        id: 'user-1',
        email: 'user@example.com',
        firstName: 'User',
        lastName: 'Example',
        accountName: 'user',
        createdAt: '2026-01-01T00:00:00.000Z',
        password: 'secret',
      },
      status: 'authenticated',
    });

    const loggedOut = sessionReducer(loggedIn, logout());
    expect(loggedOut).toEqual({ user: null, status: 'anonymous' });
  });
});
