import { describe, expect, it } from '@jest/globals';

import { getPagedEntityEmptyText } from './pagedEntityTableState';

describe('paged entity table state', () => {
  it('uses dataset empty text when there are no source rows', () => {
    expect(
      getPagedEntityEmptyText({
        emptyText: 'No records yet',
        filteredEmptyText: 'Nothing found',
        unfilteredTotal: 0,
      }),
    ).toBe('No records yet');
  });

  it('uses filtered empty text when filtering removes all rows', () => {
    expect(
      getPagedEntityEmptyText({
        emptyText: 'No records yet',
        filteredEmptyText: 'Nothing found',
        unfilteredTotal: 3,
      }),
    ).toBe('Nothing found');
  });
});
