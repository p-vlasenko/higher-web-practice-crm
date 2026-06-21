type EmptyTextParams = {
  emptyText: string;
  filteredEmptyText: string;
  unfilteredTotal: number;
};

export function getPagedEntityEmptyText({
  emptyText,
  filteredEmptyText,
  unfilteredTotal,
}: EmptyTextParams) {
  return unfilteredTotal === 0 ? emptyText : filteredEmptyText;
}
