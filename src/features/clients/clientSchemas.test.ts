import { describe, expect, it } from '@jest/globals';

import { clientSchema } from './clientSchemas';

describe('client schema', () => {
  const validClient = {
    name: 'A',
    phone: '+79990001122',
    email: 'a@b.ru',
    company: 'A',
    website: 'site.ru',
    createdAt: '2026-01-01',
    comment: '',
  };

  it('validates required fields and contact formats', () => {
    expect(clientSchema.safeParse(validClient).success).toBe(true);
    expect(
      clientSchema.safeParse({
        ...validClient,
        website: 'https://site.ru/about',
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

  it('rejects website values without a domain', () => {
    expect(
      clientSchema.safeParse({
        ...validClient,
        website: 'test',
      }).success,
    ).toBe(false);
    expect(
      clientSchema.safeParse({
        ...validClient,
        website: '123',
      }).success,
    ).toBe(false);
  });
});
