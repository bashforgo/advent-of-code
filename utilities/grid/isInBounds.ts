import { Grid } from "@utilities/grid/Grid.ts";
import { Point } from "@utilities/grid/Point.ts";

export const isInBounds = <T>(grid: Grid<T>, { x, y }: Point): boolean =>
  isInBoundsRaw(grid[0].length, grid.length, { x, y });

export const isInBoundsRaw = (
  width: number,
  height: number,
  { x, y }: Point,
): boolean => y >= 0 && y < height && x >= 0 && x < width;
