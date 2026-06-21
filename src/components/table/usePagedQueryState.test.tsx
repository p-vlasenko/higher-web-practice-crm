import { act, render, screen } from '@testing-library/react';
import { describe, expect, it } from '@jest/globals';
import { useEffect } from 'react';

import { usePagedQueryState } from './usePagedQueryState';

type HarnessProps = {
  total: number;
};

function Harness({ total }: HarnessProps) {
  const query = usePagedQueryState<'name'>({ pageSize: 10 });
  const totalPages = query.totalPages(total);

  useEffect(() => {
    query.clampPage(total);
  }, [query, total]);

  return (
    <div>
      <output aria-label='page'>{query.currentPage}</output>
      <output aria-label='offset'>{query.offset}</output>
      <output aria-label='total-pages'>{totalPages}</output>
      <button type='button' onClick={() => query.setPage(5, totalPages)}>
        page 5
      </button>
    </div>
  );
}

describe('usePagedQueryState', () => {
  it('clamps current page when total shrinks', () => {
    const { rerender } = render(<Harness total={45} />);

    act(() => {
      screen.getByRole('button', { name: 'page 5' }).click();
    });

    expect(screen.getByLabelText('page').textContent).toBe('5');
    expect(screen.getByLabelText('offset').textContent).toBe('40');

    rerender(<Harness total={12} />);

    expect(screen.getByLabelText('page').textContent).toBe('2');
    expect(screen.getByLabelText('offset').textContent).toBe('10');
    expect(screen.getByLabelText('total-pages').textContent).toBe('2');
  });
});
