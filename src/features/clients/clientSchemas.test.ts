import { describe, expect, it } from '@jest/globals';

import { clientSchema } from './clientSchemas';

describe('client schema', () => {
  it('validates required fields and contact formats', () => {
    expect(
      clientSchema.safeParse({
        name: 'A',
        phone: '+79990001122',
        email: 'a@b.ru',
        company: 'A',
        website: 'site.ru',
        createdAt: '2026-01-01',
        comment: '',
      }).success,
    ).toBe(true);
    expect(
      clientSchema.safeParse({
        name: '',
        phone: '1',
        email: 'bad',
        company: '',
        createdAt: '',
      }).success,
    ).toBe(false);
  });
});
