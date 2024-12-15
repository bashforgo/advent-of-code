import { Grid } from "@utilities/grid/Grid.ts";
import { Point } from "@utilities/grid/Point.ts";

export const getPoint = <T>(grid: Grid<T>, { x, y }: Point): T | undefined =>
  grid[y]?.[x];
