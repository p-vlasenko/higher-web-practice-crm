import { describe, expect, it } from '@jest/globals';

import type { AdapterBaseQuery } from './baseQueryAdapter';
import { getClientOptions } from './optionQueryAdapter';

describe('option query adapter', () => {
  it('excludes deleted clients before building client options', async () => {
    const baseQuery: AdapterBaseQuery = async () => ({
      data: [
        {
          id: 'c1',
          name: 'Acme',
          company: 'Acme Inc.',
          email: 'sales@acme.test',
          phone: '+79990001122',
          createdAt: '2026-06-01',
          createdBy: 'u1',
        },
        {
          id: 'c2',
          name: 'Deleted',
          company: 'Deleted Inc.',
          email: 'deleted@example.test',
          phone: '+79990001123',
          createdAt: '2026-06-01',
          createdBy: 'u1',
          deleted: true,
        },
      ],
    });

    await expect(getClientOptions(undefined, baseQuery)).resolves.toEqual({
      data: [{ value: 'c1', label: 'Acme · Acme Inc.' }],
    });
  });
});
