import { describe, expect, test } from '@jest/globals';

import { reportTabs } from './reportOptions';

describe('reports page behavior contract', () => {
  test('exposes all report tabs', () => {
    expect(reportTabs.map((tab) => tab.value)).toEqual([
      'sales',
      'clients',
      'tasks',
    ]);
  });
});
