import { describe, expect, test } from '@jest/globals';

import { profileSchema } from './profileSchemas';

describe('profile schema', () => {
  test('allows empty password update and validates email', () => {
    expect(
      profileSchema.safeParse({
        accountName: 'manager',
        email: 'manager@crm.ru',
        firstName: 'Manager',
        lastName: 'User',
        currentPassword: '',
        newPassword: '',
        passwordRepeat: '',
      }).success,
    ).toBe(true);
    expect(
      profileSchema.safeParse({
        accountName: 'manager',
        email: 'bad',
        firstName: 'Manager',
        lastName: 'User',
        currentPassword: '',
        newPassword: '',
        passwordRepeat: '',
      }).success,
    ).toBe(false);
  });

  test('requires repeated password to match new password', () => {
    expect(
      profileSchema.safeParse({
        accountName: 'manager',
        email: 'manager@crm.ru',
        firstName: 'Manager',
        lastName: 'User',
        currentPassword: 'oldpass',
        newPassword: 'newpass',
        passwordRepeat: 'badpass',
      }).success,
    ).toBe(false);
    expect(
      profileSchema.safeParse({
        accountName: 'manager',
        email: 'manager@crm.ru',
        firstName: 'Manager',
        lastName: 'User',
        currentPassword: 'oldpass',
        newPassword: 'newpass',
        passwordRepeat: 'newpass',
      }).success,
    ).toBe(true);
  });
});
