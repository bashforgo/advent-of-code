import { Grid } from "@utilities/grid/Grid.ts";

export const flipHorizontally = <T>(grid: Grid<T>): Grid<T> =>
  grid.map((row) => row.toReversed());

export const flipVertically = <T>(grid: Grid<T>): Grid<T> => grid.toReversed();
