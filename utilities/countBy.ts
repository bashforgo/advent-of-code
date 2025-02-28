export const countBy = <T, U>(
  items: Iterable<T>,
  grouping: (item: T) => U,
): Map<U, number> => {
  return new Map(
    Map.groupBy(items, grouping)
      .entries()
      .map(([group, items]) => [group, items.length]),
  );
};
