import { cx } from 'classix';
import { useMemo, useState } from 'react';

import ArrowIcon from '../../assets/icons/icons-24x24/arrow.svg?react';
import classes from './Pagination.module.css';

type PaginationProps = {
  currentPage: number;
  showJump?: boolean;
  totalPages: number;
  onPageChange: (page: number) => void;
};

type PageItem = number | 'ellipsis';

function clampPage(page: number, totalPages: number) {
  if (Number.isNaN(page)) return 1;

  return Math.min(Math.max(page, 1), totalPages);
}

function buildPageItems(currentPage: number, totalPages: number): PageItem[] {
  if (totalPages <= 5) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  if (currentPage <= 3) {
    return [1, 2, 3, 'ellipsis', totalPages];
  }

  if (currentPage >= totalPages - 2) {
    return [1, 'ellipsis', totalPages - 2, totalPages - 1, totalPages];
  }

  return [1, 'ellipsis', currentPage, 'ellipsis', totalPages];
}

export function Pagination({
  currentPage,
  showJump = true,
  totalPages,
  onPageChange,
}: PaginationProps) {
  const [pageInput, setPageInput] = useState(String(currentPage));

  const pageItems = useMemo(
    () => buildPageItems(currentPage, totalPages),
    [currentPage, totalPages],
  );

  const changePage = (page: number) => {
    const nextPage = clampPage(page, totalPages);
    setPageInput(String(nextPage));
    onPageChange(nextPage);
  };

  return (
    <nav className={classes.root} aria-label='Пагинация'>
      <button
        aria-label='Предыдущая страница'
        className={classes.arrowButton}
        disabled={currentPage === 1}
        type='button'
        onClick={() => changePage(currentPage - 1)}
      >
        <ArrowIcon aria-hidden='true' />
      </button>

      {pageItems.map((item, index) =>
        item === 'ellipsis' ? (
          <span className={classes.ellipsis} key={`ellipsis-${index}`}>
            ...
          </span>
        ) : (
          <button
            aria-current={item === currentPage ? 'page' : undefined}
            className={cx(
              classes.pageButton,
              item === currentPage && classes.pageButtonActive,
            )}
            key={item}
            type='button'
            onClick={() => changePage(item)}
          >
            {item}
          </button>
        ),
      )}

      <button
        aria-label='Следующая страница'
        className={cx(classes.arrowButton, classes.arrowButtonNext)}
        disabled={currentPage === totalPages}
        type='button'
        onClick={() => changePage(currentPage + 1)}
      >
        <ArrowIcon aria-hidden='true' />
      </button>

      {showJump ? (
        <form
          className={classes.jumpForm}
          onSubmit={(event) => {
            event.preventDefault();
            changePage(Number(pageInput));
          }}
        >
          <input
            aria-label='Номер страницы'
            className={classes.pageInput}
            inputMode='numeric'
            value={pageInput}
            onBlur={() => setPageInput(String(currentPage))}
            onChange={(event) => setPageInput(event.currentTarget.value)}
          />
          <span className={classes.jumpLabel}>Переход на страницу</span>
        </form>
      ) : null}
    </nav>
  );
}
