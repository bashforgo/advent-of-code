import { mapMapValues } from "@utilities/mapMap.ts";

export const countBy = <T, U>(
  items: Iterable<T>,
  grouping: (item: T) => U,
): Map<U, number> => {
  return mapMapValues(
    Map.groupBy(items, grouping),
    (items) => items.length,
  );
};
