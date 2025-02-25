import { Grid } from "@utilities/grid/Grid.ts";
import { getColumn } from "@utilities/grid/getColumn.ts";

export const rotateClockwise = <T>(grid: Grid<T>): Grid<T> => {
  const width = grid[0].length;
  return Array.from(
    { length: width },
    (_, x) => getColumn(grid, x).toReversed(),
  );
};

export const rotateCounterClockwise = <T>(grid: Grid<T>): Grid<T> => {
  const width = grid[0].length;
  return Array.from(
    { length: width },
    (_, x) => getColumn(grid, width - x - 1),
  );
};
