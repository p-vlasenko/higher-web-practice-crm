import { describe, expect, it } from '@jest/globals';

import { paginateItems } from './query';

describe('query pagination contract', () => {
  it('keeps filtered total separate from unfiltered total', () => {
    expect(paginateItems(['a'], { limit: 10, offset: 0 }, 3)).toEqual({
      items: ['a'],
      total: 1,
      unfilteredTotal: 3,
    });
  });
});
