import { Grid } from "@utilities/grid/Grid.ts";
import { Point } from "@utilities/grid/Point.ts";
import { gridEntries } from "@utilities/grid/gridEntries.ts";
import { setPoint } from "@utilities/grid/setPoint.ts";

export const mapGrid = <T, U>(
  grid: Grid<T>,
  select: (value: T, point: Point, partialGrid: Grid<U>) => U,
): Grid<U> => {
  const partialGrid = grid.map((row) => row.map(() => {})) as Grid<U>;

  for (const [point, value] of gridEntries(grid)) {
    setPoint(partialGrid, point, select(value, point, partialGrid));
  }

  return partialGrid;
};
