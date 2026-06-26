import { describe, expect, test } from '@jest/globals';

import { dashboardQuickActions } from './dashboardActions';

describe('dashboard page behavior contract', () => {
  test('keeps quick actions routed to creation surfaces', () => {
    expect(dashboardQuickActions).toEqual({
      addClient: '/clients',
      addDeal: '/deals',
      addTask: '/tasks',
    });
  });
});
