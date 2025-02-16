import { entries } from "@utilities/grid/entries.ts";
import { Grid } from "@utilities/grid/Grid.ts";

export const findPosition = <T>(
  grid: Grid<T>,
  predicate: (value: T) => boolean,
) => {
  return entries(grid)
    .filter(([, value]) => predicate(value))
    .take(1)
    .map(([point]) => point)
    .next()
    .value;
};
