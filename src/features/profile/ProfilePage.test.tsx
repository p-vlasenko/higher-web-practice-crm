import { describe, expect, test } from '@jest/globals';

import { toProfilePayload } from './profileService';

describe('profile page behavior contract', () => {
  test('prevents duplicate profile emails', () => {
    expect(() =>
      toProfilePayload(
        {
          accountName: 'user',
          email: 'used@crm.ru',
          firstName: 'User',
          lastName: 'One',
          currentPassword: '',
          newPassword: '',
          passwordRepeat: '',
        },
        [
          {
            accountName: 'other',
            id: '2',
            email: 'used@crm.ru',
            firstName: 'Other',
            lastName: 'User',
            createdAt: '2026-01-01',
            password: 'oldpass',
          },
        ],
        {
          accountName: 'user',
          id: '1',
          email: 'user@crm.ru',
          firstName: 'User',
          lastName: 'One',
          password: 'oldpass',
          createdAt: '2026-01-01',
        },
      ),
    ).toThrow('Email уже используется');
  });

  test('requires current password before password update', () => {
    expect(() =>
      toProfilePayload(
        {
          accountName: 'user',
          email: 'user@crm.ru',
          firstName: 'User',
          lastName: 'One',
          currentPassword: 'badpass',
          newPassword: 'newpass',
          passwordRepeat: 'newpass',
        },
        [
          {
            accountName: 'user',
            id: '1',
            email: 'user@crm.ru',
            firstName: 'User',
            lastName: 'One',
            password: 'oldpass',
            createdAt: '2026-01-01',
          },
        ],
        {
          accountName: 'user',
          id: '1',
          email: 'user@crm.ru',
          firstName: 'User',
          lastName: 'One',
          password: 'oldpass',
          createdAt: '2026-01-01',
        },
      ),
    ).toThrow('Неверный текущий пароль');
  });
});
