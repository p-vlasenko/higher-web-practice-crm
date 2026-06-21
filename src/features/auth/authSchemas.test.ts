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
      registrationSchema.safeParse({ email: 'bad', password: '1', name: '' })
        .success,
    ).toBe(false);
  });

  it('detects duplicate email', () => {
    expect(
      isEmailTaken(
        [{ id: '1', email: 'a@b.ru', name: 'A', createdAt: '2026-01-01' }],
        'A@B.ru',
      ),
    ).toBe(true);
  });
});
