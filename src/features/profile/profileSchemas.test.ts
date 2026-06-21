import { describe, expect, test } from '@jest/globals';

import { profileSchema } from './profileSchemas';

describe('profile schema', () => {
  test('allows empty password update and validates email', () => {
    expect(
      profileSchema.safeParse({
        email: 'manager@crm.ru',
        name: 'Manager',
        currentPassword: '',
        newPassword: '',
        repeatPassword: '',
      }).success,
    ).toBe(true);
    expect(
      profileSchema.safeParse({
        email: 'bad',
        name: 'Manager',
        currentPassword: '',
        newPassword: '',
        repeatPassword: '',
      }).success,
    ).toBe(false);
  });

  test('requires repeated password to match new password', () => {
    expect(
      profileSchema.safeParse({
        email: 'manager@crm.ru',
        name: 'Manager',
        currentPassword: 'oldpass',
        newPassword: 'newpass',
        repeatPassword: 'badpass',
      }).success,
    ).toBe(false);
    expect(
      profileSchema.safeParse({
        email: 'manager@crm.ru',
        name: 'Manager',
        currentPassword: 'oldpass',
        newPassword: 'newpass',
        repeatPassword: 'newpass',
      }).success,
    ).toBe(true);
  });
});
