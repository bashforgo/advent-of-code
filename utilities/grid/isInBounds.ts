import { Grid } from "@utilities/grid/Grid.ts";
import { Point } from "@utilities/grid/Point.ts";

export const isInBounds = <T>(grid: Grid<T>, { x, y }: Point): boolean =>
  y >= 0 && y < grid.length && x >= 0 && x < grid[0].length;
