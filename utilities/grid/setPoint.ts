import { Grid } from "@utilities/grid/Grid.ts";
import { Point } from "@utilities/grid/Point.ts";

export const setPoint = <T>(grid: Grid<T>, { x, y }: Point, value: T): void => {
  grid[y][x] = value;
};
