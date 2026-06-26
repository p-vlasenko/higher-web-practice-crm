import { describe, expect, test } from '@jest/globals';

import { createDealOptions } from '../../utils/optionReadModels';

describe('tasks page behavior contract', () => {
  test('builds deal options for task linking', () => {
    expect(
      createDealOptions([
        {
          id: 'd',
          title: 'Deal',
          clientId: 'c',
          amount: 1,
          status: 'new',
          createdAt: '2026-01-01',
          createdBy: 'u',
        },
      ]),
    ).toEqual([{ value: 'd', label: 'Deal' }]);
  });
});
