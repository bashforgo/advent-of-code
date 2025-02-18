import { Grid } from "@utilities/grid/Grid.ts";
import { Point, point } from "@utilities/grid/Point.ts";

export const mapGrid = <T, U>(
  grid: Grid<T>,
  select: (value: T, point: Point) => U,
): Grid<U> =>
  grid.map((row, y) => row.map((value, x) => select(value, point(x, y))));
