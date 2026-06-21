export type SortDirection = 'asc' | 'desc';

export type SortValue = string | number | boolean | null | undefined;

export type SortState<Key extends string> = {
  key: Key;
  direction: SortDirection;
};

const collator = new Intl.Collator('ru', {
  numeric: true,
  sensitivity: 'base',
});

export function toggleSort<Key extends string>(
  current: SortState<Key> | null,
  key: Key,
): SortState<Key> {
  if (current?.key === key) {
    return { key, direction: current.direction === 'asc' ? 'desc' : 'asc' };
  }

  return { key, direction: 'asc' };
}

export function compareSortValues(
  left: SortValue,
  right: SortValue,
  direction: SortDirection,
) {
  const modifier = direction === 'asc' ? 1 : -1;

  if (left == null && right == null) return 0;
  if (left == null) return 1;
  if (right == null) return -1;

  if (typeof left === 'number' && typeof right === 'number') {
    return (left - right) * modifier;
  }

  if (typeof left === 'boolean' && typeof right === 'boolean') {
    return (Number(left) - Number(right)) * modifier;
  }

  return collator.compare(String(left), String(right)) * modifier;
}

export function sortItems<T, Key extends string>(
  items: T[],
  sort: SortState<Key> | null,
  getValue: (item: T, key: Key) => SortValue,
) {
  if (!sort) return items;

  return items
    .map((item, index) => ({ item, index }))
    .sort((left, right) => {
      const result = compareSortValues(
        getValue(left.item, sort.key),
        getValue(right.item, sort.key),
        sort.direction,
      );
      
      return result || left.index - right.index;
    })
    .map(({ item }) => item);
}
