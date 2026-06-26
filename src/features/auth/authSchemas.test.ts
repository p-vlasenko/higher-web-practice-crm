import { describe, expect, it } from '@jest/globals';

import { isEmailTaken } from './authService';
import { loginSchema, registrationSchema } from './authSchemas';

describe('auth schemas', () => {
  it('validates login and registration payloads', () => {
    expect(
      loginSchema.safeParse({ email: 'manager@crm.ru', password: '123456' })
        .success,
    ).toBe(true);
    expect(
      registrationSchema.safeParse({
        accountName: '',
        email: 'bad',
        firstName: '',
        lastName: '',
        password: '1',
        passwordRepeat: '2',
      }).success,
    ).toBe(false);
  });

  it('detects duplicate email', () => {
    expect(
      isEmailTaken(
        [
          {
            accountName: 'a',
            createdAt: '2026-01-01',
            email: 'a@b.ru',
            firstName: 'A',
            id: '1',
            lastName: 'User',
            password: '123456',
          },
        ],
        'A@B.ru',
      ),
    ).toBe(true);
  });
});
