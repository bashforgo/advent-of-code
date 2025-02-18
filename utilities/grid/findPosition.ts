import { Grid } from "@utilities/grid/Grid.ts";
import { gridEntries } from "@utilities/grid/gridEntries.ts";

export const findPosition = <T>(
  grid: Grid<T>,
  predicate: (value: T) => boolean,
) => {
  return gridEntries(grid)
    .filter(([, value]) => predicate(value))
    .take(1)
    .map(([point]) => point)
    .next()
    .value;
};
