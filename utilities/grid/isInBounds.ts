import { Grid } from "@utilities/grid/Grid.ts";
import { Point } from "@utilities/grid/Point.ts";

export const isInBounds = <T>(grid: Grid<T>, { x, y }: Point): boolean =>
  x >= 0 && x < grid.length && y >= 0 && y < grid[0].length;
