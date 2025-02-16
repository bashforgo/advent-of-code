import { Grid } from "@utilities/grid/Grid.ts";
import { Point } from "@utilities/grid/Point.ts";

export const swap = <T>(grid: Grid<T>, a: Point, b: Point) => {
  const alteredRows = new Set([a.y, b.y]);
  const copy = grid.map((row, y) => alteredRows.has(y) ? [...row] : row);
  [copy[a.y][a.x], copy[b.y][b.x]] = [copy[b.y][b.x], copy[a.y][a.x]];
  return copy;
};
