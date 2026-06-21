import { describe, expect, test } from '@jest/globals';

import { dealSchema } from './dealSchemas';

describe('deal schema validation', () => {
  test('accepts active deal payloads and rejects negative amounts', () => {
    expect(
      dealSchema.safeParse({
        title: 'Deal',
        clientId: 'client',
        amount: 0,
        status: 'new',
        createdAt: '2026-01-01',
      }).success,
    ).toBe(true);
    expect(
      dealSchema.safeParse({
        title: 'Deal',
        clientId: 'client',
        amount: -1,
        status: 'new',
        createdAt: '2026-01-01',
      }).success,
    ).toBe(false);
  });
});
